package routes

import (
	"net/http"

	"coliving-crew.xyz/server/internal/handlers"
	"coliving-crew.xyz/server/internal/pbModels"
	"coliving-crew.xyz/server/internal/routes/validators"
	"github.com/go-playground/validator"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterFlatCommentRoutes(se *core.ServeEvent, pbi *pocketbase.PocketBase) error {

	rootPath := "/api/flatComments"
	fch := new(handlers.FlatCommentHandler)

	se.Router.Validator = &validators.FlatCommentValidator{Validator: validator.New()}

	se.Router.POST(rootPath, func(c echo.Context) error {

		fc := new(pbModels.FlatComment)
		if err := c.Bind(fc); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
		if err := c.Validate(fc); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		res, err := fch.AddNewComment(pbi.Dao(), fc)
		if err != nil {
			return err
		}

		return c.JSON(http.StatusCreated, res)
	})

	return nil
}
