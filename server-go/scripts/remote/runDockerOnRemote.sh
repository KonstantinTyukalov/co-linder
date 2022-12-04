#!/bin/bash

port=3000
volume_name="coliving-app-data"
container_name="coliving-app-server"
image_name="qinamrug/coliving-crew-server"

sudo docker run -d \
    --name ${container_name} \
    -t \
    -p ${port}:${port} \
    -v ${volume_name}:/usr/local/bin/app/pb_data \
    ${image_name}:latest
