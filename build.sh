#!/usr/bin/env bash

NODE_RUNTIME="node:11.5.0-alpine"

docker run --rm -it -v `pwd`:/app/ ${NODE_RUNTIME} node /app/build.js