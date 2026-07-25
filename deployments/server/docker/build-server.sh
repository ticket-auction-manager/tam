#!/bin/sh

source ../../version.env
docker compose build
docker tag dbob16/tam-server:latest dbob16/tam-server:${TAM_VERSION}
docker tag dbob16/tam-rp:latest dbob16/tam-rp:${TAM_VERSION}
echo "TAM_PWD=changeme" > dist/prod.env
TAM_VERSION=${TAM_VERSION} envsubst '$TAM_VERSION' < ./compose.yml.template > ./dist/compose.yml
