# match-shared-app

### Start back-end

Using https://github.com/codegangsta/gin:
- Run `go install github.com/codegangsta/gin@latest`.
- Make sure that $GOPATH/bin in PATH environment variable to have access to `gin` (it is usually $HOME/go/bin).
- Go to "server-go" in console.
- Run `gin --appPort 8090 run serve`. After "[gin] Build finished" (takes up to a minute first time) it should provide 2 URL-s to work with.
