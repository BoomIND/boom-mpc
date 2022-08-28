#!/bin/bash
image=lambdabuildpkg
docker build -t $image .
id=$(docker create $image)
docker cp $id:dist - | tar x
docker rm -v $id