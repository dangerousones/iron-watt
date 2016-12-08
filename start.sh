#!/bin/bash

WORKDIR=$PWD

cd $(dirname $0)
npm install

cd $WORKDIR
npm start