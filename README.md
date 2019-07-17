# Argo UI

![Argo Image](https://github.com/argoproj/argo/blob/master/argo.png?raw=true)

A web-based UI for the Argo Workflow engine. 

The UI has the following features:
* View live Argo Workflows running in the cluster
* View completed Argo Workflows
* View container logs

Some Argo UI components ( such as Workflow DAG viewer, Workflow timeline etc ) are distributed in the [argo-ui](https://www.npmjs.com/package/argo-ui) NPM package.

## Build, run, release

* Install [NodeJS](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com)
* Run: `yarn start` - starts API server and webpack dev UI server. API server uses current `kubectl` context to access workflow CRDs.
* Build: `yarn build` - builds static resources into `./dist` directory.
* Release: `IMAGE_NAMESPACE=argoproj IMAGE_TAG=latest DOCKER_PUSH=true yarn docker` - builds docker image and optionally push to docker registry.
