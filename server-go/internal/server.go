package server

import (
	"log"

	// "coliving-crew.xyz/server/internal/routes"
	"coliving-crew.xyz/server/internal/routes"
	"coliving-crew.xyz/server/internal/services"
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

	app.pbi.Bootstrap()

	log.Println("Configured pocketbase instance")

	// cs := new(services.ChatService)

	ts := new(services.TestService)

	ts.CreateCollection(app.pbi.Dao())

	// cs.SaveNewChatMessage(app.pocketbase.Dao(), )
	// SaveNewChatMessage

	bootstrapErr := app.pbi.Bootstrap()
	if bootstrapErr != nil {
		return bootstrapErr
	}

	return app.pbi.Start()
}

func (app *ServerApp) RegisterRoutes() error {
	log.Println("Registering routes...")
	app.pbi.OnBeforeServe().
		Add(func(e *core.ServeEvent) error {
			err := routes.RegisterFlatRoutes(e, app.pbi)

			if err != nil {
				return err
			}

			return nil
		})

	return nil
}
