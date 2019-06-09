#!/usr/bin/env bash

set -euxo pipefail

npm run cy:verify

mkdir it
rsync -rv . it/ --exclude it --exclude node_modules --exclude elm-stuff --exclude .git --exclude .vscode --exclude .idea
cd it && npm ci
npm run test:it
cd .. && rm -rf it

npm run build