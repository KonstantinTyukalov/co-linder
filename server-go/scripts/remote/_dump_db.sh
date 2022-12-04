#!/bin/bash

dump_name=$(date +%Y_%m_%d_%H.%M.%S.%3N)
dumps_path="/home/ubuntu/db_dumps"
dump_path="${dumps_path}/${dump_name}"
volume_path="/var/snap/docker/common/var-lib-docker/volumes/coliving-app-data/_data"

echo DUMP PATH = "$dump_path"

mkdir "$dump_path"

cp -r "${volume_path}/" "$dump_path"

zip -r "${dump_name}.zip" "$dump_name"

rm -rf "$dump_path"
