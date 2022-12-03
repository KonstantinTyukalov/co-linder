package server

import (
	"log"

	"coliving-crew.xyz/server/internal/routes"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

// // https://go.dev/doc/effective_go#init
// func (app *ServerApp) Init() {
// 	log.Println("Creatin new pocketbase instace...")
// 	app.pb = pocketbase.New()
// }

type ServerApp struct {
	pbi *pocketbase.PocketBase
}

func NewServerApp() *ServerApp {
	return &ServerApp{
		pbi: pocketbase.New(),
	}
}

func (app *ServerApp) Run() error {

	if app.pbi == nil {
		log.Fatal("PocketBase instance not initialized")
	}

	bootstrapErr := app.pbi.Bootstrap()
	if bootstrapErr != nil {
		return bootstrapErr
	}

	return app.pbi.Start()
}

func (app *ServerApp) RegisterRoutes() error {
	log.Println("Registering routes...")

	app.pbi.OnBeforeServe().
		Add(func(se *core.ServeEvent) error {

			if err := routes.RegisterFlatRoutes(se, app.pbi); err != nil {
				return err
			}
			if err := routes.RegisterFlatCommentRoutes(se, app.pbi); err != nil {
				return err
			}

			return nil
		})

	return nil
}
