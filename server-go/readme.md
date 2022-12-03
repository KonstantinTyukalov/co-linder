# Co-living Crew backend Go app

- Go v1.19
- PocketBase v0.8.0

## How to run

```sh
cd cmd && go run main.go serve
```

With specific ip + port:

```sh
cd cmd
go run main.go serve --http="<yourIp>:<yourPort>"
```

> To share the server through the local network, you should specify your LAN Wi-Fi IP address.

### Hot reload

Using <https://github.com/codegangsta/gin>:

- Run `go install github.com/codegangsta/gin@latest`.
- Make sure that `$GOPATH/bin` in `PATH` environment variable to have access to `gin` (it is usually `$HOME/go/bin`).
- Go to "server-go" in console.
- Run `gin --appPort 8090 run serve`.
 After `[gin] Build finished` (takes up to a minute first time) it should provide 2 URL-s to work with.
- Open Admin part at <http://localhost:3000/_/#/login>.
- Profit.
