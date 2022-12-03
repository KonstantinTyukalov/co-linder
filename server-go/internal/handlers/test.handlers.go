package handlers

import (
	"net/http"

	"coliving-crew.xyz/server/internal/services"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/daos"
)

type TestHandler struct{}

func (th *TestHandler) HandleHello(c echo.Context) error {

	return c.JSON(http.StatusOK, "hello from test route")
}

func (th *TestHandler) HandleCreateCollection(c echo.Context, dao *daos.Dao) error {

	ts := new(services.TestService)

	ts.CreateCollection(dao)

	return nil
}
