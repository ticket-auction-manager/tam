#!/bin/sh

if [ ! -d "./data" ]; then
  mkdir ./data
fi
NODE_TLS_REJECT_UNAUTHORIZED=0 BODY_SIZE_LIMIT=Infinity HOST=localhost PORT=3000 ./exe/bin/node ./build
