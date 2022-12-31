param(
    [switch]$Docker
)

$dockerImageName = qinamrug/coliving-crew-server

$scriptPath = split-path -parent $MyInvocation.MyCommand.Definition
$serverProjectSource = Join-Path $scriptPath ..

if ($Docker) {
    docker build --no-cache -t $dockerImageName $serverProjectSource
}
else {
    go build -v -o $serverProjectSource/build ./...
}
