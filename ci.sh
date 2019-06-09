#!/usr/bin/env bash

npm run cy:verify
npm run build
mkdir it && cp -r !(it|node_modules|elm-stuff) it/ && cd it && npm ci
npm run test:it
cd .. && rm -rf it