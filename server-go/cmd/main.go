package main

import (
	"log"

	server "coliving-crew.xyz/server/internal"
)

func main() {

	app := server.NewServerApp()

	if routesErr := app.RegisterRoutes(); routesErr != nil {
		log.Fatal(routesErr)
	}

	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
