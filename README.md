# Argo UI

![Argo Image](argo.png)

Web-based UI for Argo workflow engine. Web UI allows to view Argo workflows running in the cluster, view container logs etc.

## Build, run, release

* Install [NodeJS](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com)
* Run: `yarn dev` - starts API server and webpack dev UI server. API server uses current `kubectl` context to access workflow CRDs.
* Build: `yarn build` - builds static resources into `./dist` directory.
* Release: `IMAGE_NAMESPACE=argoproj IMAGE_TAG=latest DOCKER_PUSH=true yarn docker` - builds docker image and optionally push to docker registry.
