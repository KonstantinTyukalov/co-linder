package main

import (
	"log"

	"github.com/pocketbase/pocketbase"
)

func main() {
	app := pocketbase.New()

	// app.OnCollectionsListRequest().Add(func(e *core.CollectionsListEvent) error {
	// 	log.Println(e.Result)
	// 	return nil
	// })

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
