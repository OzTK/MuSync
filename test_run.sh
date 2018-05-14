#!/bin/bash

mv js/config.ci.js js/config.dev.js
mv elm/Spotify.elmock elm/Spotify.elm
npm start &