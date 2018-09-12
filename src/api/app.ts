import * as aws from 'aws-sdk';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as JSONStream from 'json-stream';
import * as Api from 'kubernetes-client';
import * as path from 'path';
import { Observable, Observer } from 'rxjs';
import * as nodeStream from 'stream';

import * as models from '../models';
import * as consoleProxy from './console-proxy';

import { decodeBase64, reactifyStringStream, streamServerEvents } from './utils';

function serve<T>(res: express.Response, action: () => Promise<T>) {
    action().then((val) => res.send(val)).catch((err) => {
        res.status(500).send(err);
    });
}

function fileToString(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        });
    });
}

export function create(
        uiDist: string,
        uiBaseHref: string,
        inCluster: boolean,
        namespace: string,
        forceNamespaceIsolation: boolean,
        instanceId: string,
        version,
        group = 'argoproj.io') {
    const config = Object.assign(
        {}, inCluster ? Api.config.getInCluster() : Api.config.fromKubeconfig(), {namespace, promises: true });
    const core = new Api.Core(config);
    const crd = new Api.CustomResourceDefinitions(Object.assign(config, {version, group}));
    crd.addResource('workflows');
    const app = express();
    app.use(bodyParser.json({type: () => true}));

    function getWorkflowLabelSelector(req) {
        const labelSelector: string[] = [];
        if (instanceId) {
            labelSelector.push(`workflows.argoproj.io/controller-instanceid = ${instanceId}`);
        }
        if (req.query.phase) {
            const phases = req.query.phase instanceof Array ? req.query.phase : [req.query.phase];
            if (phases.length > 0) {
                labelSelector.push(`workflows.argoproj.io/phase in (${phases.join(',')})`);
            }
        }
        return labelSelector;
    }

    app.get('/api/workflows', (req, res) => serve(res, async () => {
        const labelSelector = getWorkflowLabelSelector(req);

        const workflowList = await (forceNamespaceIsolation ? crd.ns(namespace) : crd).workflows.get({
            qs: { labelSelector: labelSelector.join(',') },
        }) as models.WorkflowList;

        workflowList.items.sort(models.compareWorkflows);
        return workflowList;
    }));

    app.get('/api/workflows/:namespace/:name',
        async (req, res) => serve(res, () => (forceNamespaceIsolation ? crd.ns(namespace) : crd.ns(req.params.namespace)).workflows.get(req.params.name)));

    app.get('/api/workflows/live', async (req, res) => {
        let updatesSource = new Observable((observer: Observer<any>) => {
            const labelSelector = getWorkflowLabelSelector(req);
            let stream = crd.ns(req.params.namespace).workflows.getStream({ qs: { watch: true, labelSelector: labelSelector.join(',') } });
            stream.on('end', () => observer.complete());
            stream.on('error', (e) => observer.error(e));
            stream.on('close', () => observer.complete());
            stream = stream.pipe(new JSONStream());
            stream.on('data', (data) => data && observer.next(data));
        });
        if (forceNamespaceIsolation || req.query.namespace) {
            updatesSource = updatesSource.filter((change) => {
                return change.object.metadata.namespace === forceNamespaceIsolation ? namespace : req.query.namespace;
            });
        }
        if (req.query.name) {
            updatesSource = updatesSource.filter((change) => change.object.metadata.name === req.query.name);
        }
        streamServerEvents(req, res, updatesSource, (item) => JSON.stringify(item));
    });

    function getNamespaceCrd(req) {
        return (forceNamespaceIsolation ? crd.ns(namespace) : crd.ns(req.params.namespace));
    }

    app.get('/api/workflows/:namespace/:name/artifacts/:nodeId/:artifactName', async (req, res) => {
        const workflow: models.Workflow = await getNamespaceCrd(req).workflows.get(req.params.name);
        const node = workflow.status.nodes[req.params.nodeId];
        const artifact = node.outputs.artifacts.find((item) => item.name === req.params.artifactName);
        if (artifact.s3) {
            try {
                const secretAccessKey = decodeBase64((await core.ns(
                    workflow.metadata.namespace).secrets.get(artifact.s3.secretKeySecret.name)).data[artifact.s3.secretKeySecret.key]).trim();
                const accessKeyId = decodeBase64((await core.ns(
                    workflow.metadata.namespace).secrets.get(artifact.s3.accessKeySecret.name)).data[artifact.s3.accessKeySecret.key]).trim();
                const s3 = new aws.S3({
                    region: artifact.s3.region, secretAccessKey, accessKeyId, endpoint: `http://${artifact.s3.endpoint}`, s3ForcePathStyle: true, signatureVersion: 'v4' });
                s3.getObject({ Bucket: artifact.s3.bucket, Key: artifact.s3.key }, (err, data) => {
                    if (err) {
                        // tslint:disable-next-line:no-console
                        console.error(err);
                        res.send({ code: 'INTERNAL_ERROR', message: 'Unable to download artifact' });
                    } else {
                        const readStream = new nodeStream.PassThrough();
                        readStream.end(data.Body);
                        res.set('Content-disposition', 'attachment; filename=' + path.basename(artifact.s3.key));
                        readStream.pipe(res);
                    }
                });
            } catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                res.send({ code: 'INTERNAL_ERROR', message: 'Unable to download artifact' });
            }
        } else {
            res.send({ code: 'INTERNAL_ERROR', message: 'Artifact source is not supported' });
        }
    });

    function getNamespace(req: express.Request) {
        return forceNamespaceIsolation ? namespace : req.query.namespace;
    }

    app.get('/api/logs/:namespace/:nodeId/:container', async (req: express.Request, res: express.Response) => {
        const logsSource = reactifyStringStream(
            core.ns(getNamespace(req)).po(req.params.nodeId).log.getStream({ qs: { container: req.params.container, follow: true } }));
        streamServerEvents(req, res, logsSource, (item) => item.toString());
    });

    const serveIndex = (req: express.Request, res: express.Response) => {
        fileToString(`${uiDist}/index.html`).then((content) => {
            return content.replace(`<base href="/">`, `<base href="${uiBaseHref}">`);
        })
        .then((indexContent) => res.send(indexContent))
        .catch((err) => res.send(err));
    };

    app.get('/index.html', serveIndex);
    app.use(express.static(uiDist, {index: false}));
    app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {
            serveIndex(req, res);
        } else {
            next();
        }
    });

    const server = http.createServer(app);
    consoleProxy.create(server, core);

    return server;
}
