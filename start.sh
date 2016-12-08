#!/bin/bash

WORKDIR=$PWD

cd $(dirname $0)
npm install

cd $WORKDIR
#node $(dirname $0)
bash