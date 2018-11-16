#!/bin/bash

mv js/config.ci.js js/config.dev.js
mv elm/Spotify.elmock elm/Spotify.elm
mv elm/Deezer.elmock elm/Deezer.elm
npm start &
