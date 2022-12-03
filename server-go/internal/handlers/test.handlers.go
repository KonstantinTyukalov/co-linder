package handlers

import (
	"net/http"

	"github.com/labstack/echo/v5"
)

type TestHandler struct{}

func (th *TestHandler) HandleHello(c echo.Context) error {

	return c.JSON(http.StatusOK, "hello from test route")
}

// func HandleCreateCollection(c echo.Context) error {

// }
