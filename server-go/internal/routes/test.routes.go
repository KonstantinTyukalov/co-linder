package routes

import (
	"log"
	"net/http"

	"coliving-crew.xyz/server/internal/handlers"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterTestRoutes(se *core.ServeEvent, pbi *pocketbase.PocketBase) error {

	rootPath := "/api/test"
	th := new(handlers.TestHandler)

	// or you can also use the shorter e.Router.GET("/articles/:slug", handler, middlewares...)
	_, err := se.Router.AddRoute(echo.Route{
		Method:  http.MethodGet,
		Path:    rootPath + "/hello",
		Handler: th.HandleHello,
	})

	if err != nil {
		log.Print("ERROR WHEN CONFIGURING ROUTES")
		return err
	}

	se.Router.GET(rootPath+"/collection", func(c echo.Context) error {
		th.HandleCreateCollection(c, pbi.Dao())
		return nil
	})

	return nil
}
