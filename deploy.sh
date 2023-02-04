#!/bin/bash
tar --exclude="node_modules" --exclude="dist" --exclude=".env" --exclude=".github" --exclude="yarn.lock" --exclude=".idea" --exclude="deploy"   -zcvf SERVICE.tgz *
cp SERVICE.tgz ./deploy && rm -rf SERVICE.tgz
cd ./deploy && chmod +x deploy.sh