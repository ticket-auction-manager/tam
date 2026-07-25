#!/bin/sh

if [ -x "$(command -v docker)" ]; then
  docker compose --env-file ./prod.env down
elif [ -x "$(command -v podman)" ]; then
  podman compose --env-file ./prod.env down
fi
