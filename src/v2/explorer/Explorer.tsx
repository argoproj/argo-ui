import * as React from 'react';
import {Alert} from '../components';
import {Brand} from '../components/header/header';
import * as Components from '../components';
import {AlertType} from '../components/alert/alert';
import * as babel from '@babel/standalone';
import Editor from '../components/code-editor/code-editor';
import * as lzString from 'lz-string';
import {createBrowserHistory} from 'history';
import * as prettier from 'prettier/standalone';
import {Options} from 'prettier';
import * as babelParser from 'prettier/parser-babel';
const history = createBrowserHistory();

import './Explorer.scss';
import {faClipboard, faCode} from '@fortawesome/free-solid-svg-icons';
import {ComponentDocs} from '../types/documentation';
import {InfoItemKind, InfoItemRow} from '../components/info-item/info-item';

const prettierConfig = {
    bracketSpacing: false,
    jsxSingleQuote: true,
    printWidth: 180,
    semi: false,
    singleQuote: true,
    tabWidth: 4,
    jsxBracketSameLine: true,
    quoteProps: 'consistent',
} as Options;

const CODE_PARAM_KEY = 'codeHash';

const scopeEval = (source: string, scope: any) => {
    const keys = [];
    const values = [];
    for (const key in scope) {
        if (!{}.hasOwnProperty.call(scope, key)) continue;
        const value = scope[key];
        if (key === 'this') {
            continue;
        }
        keys.push(key);
        values.push(value);
    }
    return Function(...keys, `return eval(${JSON.stringify(source)})`).apply(scope.this, values);
};

const compileJsx = (code: string) => babel.transform(`<React.Fragment>${code.trim() || ''}</React.Fragment>`, {presets: ['react']}).code;

class CatchErrors extends React.Component<{code: string}> {
    componentDidCatch(error: Error, info: React.ErrorInfo) {
        const {code} = this.props;
        this.setState({invalidCode: code, error, info});
    }

    state: {
        error: Error;
        invalidCode: string;
        info: React.ErrorInfo;
    } = {
        error: null,
        invalidCode: null,
        info: null,
    };

    render() {
        const {error, info} = this.state;
        const {children} = this.props;

        if (!error) {
            return children;
        }

        const componentStack = info?.componentStack
            .split('\n')
            .filter((line: string) => /RenderCode/.test(line))
            .map((line: string) => line.replace(/ \(created by .*/g, ''));

        const lines = componentStack?.slice(0, componentStack.length - 1);

        return (
            <div>
                <Alert type={AlertType.Error}>{error?.message}</Alert>
                {(lines || []).map((line: string, i: number) => (
                    <span key={i}>{line}</span>
                ))}
            </div>
        );
    }
}

interface Node {
    children: any[];
    name: string;
}

const Explorer = () => {
    const [compiled, setCompiled] = React.useState(null);
    const [rendered, setRendered] = React.useState(null);
    const [error, setError] = React.useState(null);
    const params = new URLSearchParams(window.location.search);
    const decompressed = lzString.decompressFromEncodedURIComponent(params.get(CODE_PARAM_KEY) || '');
    const [code, setCode] = React.useState(decompressed || '');
    const [componentsInUse, setComponentsInUse] = React.useState([] as ComponentDocs[]);

    React.useEffect(() => {
        if (code) {
            const compressed = lzString.compressToEncodedURIComponent(code);
            params.set(CODE_PARAM_KEY, compressed);
            history.push({search: '?' + params.toString()});
        }
    }, [code]);

    React.useEffect(() => {
        try {
            setCompiled(compileJsx(code));
            setError(null);
        } catch (e) {
            setError((e.message as string) || null);
        }
    }, [code]);

    const formatCode = () => {
        const wrapped = `<>${code}</>;`;
        const formatted = prettier.format(wrapped, {...prettierConfig, parser: 'babel', plugins: [babelParser]});
        const unwrapped = formatted.slice(3, formatted.length - 4);
        setCode(unwrapped);
    };

    const traverse = (node: Node, docs: ComponentDocs[]) => {
        if (!node || !node.children || node.children.length < 1) {
            return;
        }
        let children = [...node.children];
        while (children && children.length > 0) {
            let next = children.pop();
            let nextNode: Node = {
                children: processChildren(next),
                name: processName(next),
            };
            if (nextNode.name !== 'Unknown') {
                docs.push({
                    name: nextNode.name,
                    description: next.type?.docs?.description || '',
                    props: next.type?.docs?.props || [],
                });
            }
            traverse(nextNode, docs);
        }
    };

    const processName = (raw: any): string => {
        if (!raw || !raw.type) {
            return 'Unknown';
        }
        if (typeof raw.type === 'string') {
            return raw.type;
        }
        return raw.type.name || 'Unknown';
    };

    const processChildren = (raw: any): any[] => {
        if (!raw || !raw.props || !raw.props.children) {
            return [];
        }
        const children = raw.props.children;
        if (children.length && children.length > 0) {
            return children;
        }
        return [children];
    };

    React.useEffect(() => {
        try {
            const r = scopeEval(compiled, {React, ...Components, componentsInUse});
            setRendered(r);
            const docs: ComponentDocs[] = [];
            traverse({name: processName(r), children: processChildren(r)}, docs);
            setComponentsInUse(docs);
        } catch (e) {
            setError((e.message as string) || null);
        }
    }, [compiled]);

    return (
        <React.Fragment>
            <Components.Header>
                <Brand brandName='Argo UI Explorer' />
                <div style={{marginLeft: 'auto', display: 'flex'}}>
                    <Components.ActionButton action={() => navigator.clipboard.writeText(window.location.href)} label='Copy URL' icon={faClipboard} />
                    <Components.ActionButton action={() => formatCode()} label='Format Code' style={{marginLeft: '5px'}} icon={faCode} />
                </div>
            </Components.Header>

            <div className='sandbox'>
                <CatchErrors code={''}>{rendered}</CatchErrors>
            </div>
            <div style={{margin: '0 10px'}}>
                {error && <Alert type={AlertType.Error}>{error}</Alert>}
                <div style={{height: '20em', marginTop: '1em'}}>
                    <Editor setCode={setCode} init={code} />
                </div>
            </div>
            <div style={{marginTop: '1em', paddingLeft: '10px'}}>
                <Components.Columns
                    items={componentsInUse.map((c) => {
                        return {
                            name: c.name,
                            children: c.props.map((prop) => {
                                return {
                                    name: prop.name,
                                    leaf: (
                                        <div>
                                            <h2 style={{marginTop: 0}}>
                                                {c.name} / {prop.name}
                                            </h2>
                                            <InfoItemRow items={{content: prop.type, kind: InfoItemKind.Monospace}} label='Type' />
                                            <div style={{marginTop: '1.5em'}}>{prop.description}</div>
                                        </div>
                                    ),
                                };
                            }),
                        };
                    })}
                />
            </div>
        </React.Fragment>
    );
};

export default Explorer;
