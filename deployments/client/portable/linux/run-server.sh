#!/bin/sh

if [ ! -d "./data" ]; then
  mkdir ./data
fi
HOST=127.0.0.1 PORT=3000 ./exe/bin/node ./build
