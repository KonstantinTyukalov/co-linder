package main

import (
	"log"

	"coliving-crew.com/server"
)

func main() {

	server := server.ServerApp

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
