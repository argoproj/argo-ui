#!/bin/bash

set -e

TAG=${IMAGE_TAG:-'latest'}

docker build --build-arg ARGO_VERSION=${TAG} -t ${IMAGE_NAMESPACE:-`whoami`}/argoui:${TAG} .

if [ "$DOCKER_PUSH" == "true" ]
then
    docker push ${IMAGE_NAMESPACE:-`whoami`}/argoui:${TAG}
fi
