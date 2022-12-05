$localIpAddr = (Get-NetIPAddress -InterfaceAlias Wi-Fi -AddressFamily IPv4).IPAddress

npm run start -- --allowed-hosts all --host $localIpAddr
