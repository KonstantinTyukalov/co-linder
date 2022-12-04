$scriptPath = split-path -parent $MyInvocation.MyCommand.Definition

$rootPath =  Join-Path $scriptPath .. | Resolve-Path

$appEntryPath = Join-Path $rootPath cmd

$dumpsPath = Join-Path $rootPath db_dumps remote

$remoteDumps = Get-ChildItem -Path "$dumpsPath " -Name | Sort-Object -Descending

$lastDumpArchive = $remoteDumps[0]

Write-Host $lastDumpArchive

$temp = "$appEntryPath\temp"

Expand-Archive $dumpsPath\$lastDumpArchive -DestinationPath $temp

$dumpName = $lastDumpArchive -replace '.zip', ''

Write-Host dump name = $dumpName

Write-Host "Removing local db..."
Remove-Item -Recurse -Path $appEntryPath\pb_data

Move-Item -Path "$temp\$dumpName\_data\" -Destination "$appEntryPath\pb_data" -Force

Remove-Item -Recurse -Path $temp
