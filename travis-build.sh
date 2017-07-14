#!/bin/bash
# Set these environment variables
#DOCKER_TAG=
#DOCKER_USER=
#DOCKER_AUTH=

set -o errexit -o nounset -o xtrace

test/test.sh

ORG=${ORG:-hsldevcom}
DOCKER_TAG=${TRAVIS_BUILD_ID:-latest}
DOCKER_IMAGE=digitransit-proxy:$DOCKER_TAG
LATEST_IMAGE=$ORG/digitransit-proxy:latest
PROD_IMAGE=$ORG/digitransit-proxy:prod

echo Building digitransit-proxy: $DOCKER_IMAGE

docker build  --tag=$DOCKER_IMAGE -f Dockerfile .

if [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  DOCKER_IMAGE=$ORG/graphiql:${DOCKER_TAG}
  echo Pushing container: ${LATEST_IMAGE}
  docker tag ${DOCKER_IMAGE} ${LATEST_IMAGE}
  docker login -u ${DOCKER_USER} -p ${DOCKER_AUTH}
  docker push ${LATEST_IMAGE}
fi

echo Build completed
