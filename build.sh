#!/usr/bin/env sh

build() {
    echo 'Building React'

    rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    npx react-scripts build

    mkdir -p dist

    cp -r './manifest.json' dist

    cp -r './src/content-scripts/contentScript.js' dist

    cp -r build/* dist
}

build