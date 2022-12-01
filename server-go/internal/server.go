package server

import (
	"log"

	"github.com/pocketbase/pocketbase"
)

// https://go.dev/doc/effective_go#init
// func init() {
//     if user == "" {
//         log.Fatal("$USER not set")
//     }
//     if home == "" {
//         home = "/home/" + user
//     }
//     if gopath == "" {
//         gopath = home + "/go"
//     }
//     // gopath may be overridden by --gopath flag on command line.
//     flag.StringVar(&gopath, "gopath", gopath, "override default GOPATH")
// }

type ServerApp struct {
	pocketbase *pocketbase.PocketBase
}

func (app *ServerApp) Run() error {

	app.pocketbase = pocketbase.New()

	log.Println("Configured pocketbase instance")

	return app.pocketbase.Start()
}
