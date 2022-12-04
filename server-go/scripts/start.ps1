param(
    [switch]$Docker
)

$scriptPath = split-path -parent $MyInvocation.MyCommand.Definition

$serverProjectSource = Join-Path $scriptPath ..

$localIpAddr = (Get-NetIPAddress -InterfaceAlias Wi-Fi -AddressFamily IPv4).IPAddress

$port = 3000

if ($Docker) {
    docker run -d --name coliving-app-server -t -p ${port}:${port} -v coliving-app-data://usr/local/bin/app/pb_data qinamrug/coliving-crew-server:latest
}
else {
    $entryPointPath = Join-Path $serverProjectSource cmd main.go
    go run $entryPointPath serve --http="${localIpAddr}:${port}"
}


# sudo docker container create qinamrug/coliving-crew-server