package main

import (
	"log"

	server "coliving-crew.xyz/server/internal"
)

func main() {

	app := new(server.ServerApp)

	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
