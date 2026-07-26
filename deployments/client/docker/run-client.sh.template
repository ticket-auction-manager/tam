#!/bin/sh

source ./prod.env

if [ -x "$(command -v docker)" ]; then
  docker run -d --name tam-client --network host --env-file ./prod.env -v tam-data:/data --restart unless-stopped dbob16/tam-client:${TAM_VERSION}
elif [ -x "$(command -v podman)" ]; then
  podman run -d --name tam-client --network host --env-file ./prod.env -v tam-data:/data --restart unless-stopped dbob16/tam-client:${TAM_VERSION}
fi
