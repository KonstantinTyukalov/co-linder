param(
    [switch]$Docker
)
$startPath = Get-Location
$scriptPath = split-path -parent $MyInvocation.MyCommand.Definition

$serverProjectSource = Join-Path $scriptPath .. | Resolve-Path

$localIpAddr = (Get-NetIPAddress -InterfaceAlias Wi-Fi -AddressFamily IPv4).IPAddress

$port = 3000

if ($Docker) {
    docker run -d --name coliving-app-server -t -p ${port}:${port} -v coliving-app-data://usr/local/bin/app/pb_data qinamrug/coliving-crew-server:latest
}
else {
    $entryPointPath = Join-Path $serverProjectSource cmd
    Set-Location $entryPointPath
    go run main.go serve --http="${localIpAddr}:${port}"
}

# sudo docker container create qinamrug/coliving-crew-server