#!/bin/bash

build() {
    echo 'Building React'

    rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    react-scripts build

    mkdir -p dist

    cp -r './manifest.json' './src/devtools/devtools.html' './src/devtools/devtools.js' dist

    cp -r build/* dist
}

build