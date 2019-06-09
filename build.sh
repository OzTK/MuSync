#!/usr/bin/env bash

rsync -rv . dist/ --exclude-from dist_exclude_list.txt
elm make elm/Main.elm --output=dist/js/elm.js --optimize