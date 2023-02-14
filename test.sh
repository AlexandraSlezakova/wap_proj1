#!/bin/bash

if [ -z "$1" ]; then
    npm run test
elif [ "$1" == 'install' ]; then
    npm install
fi