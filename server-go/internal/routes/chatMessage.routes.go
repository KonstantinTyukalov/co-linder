package routes

import (
	"net/http"

	"coliving-crew.xyz/server/internal/constants"
	"coliving-crew.xyz/server/internal/handlers"
	"coliving-crew.xyz/server/internal/pbModels"
	"coliving-crew.xyz/server/internal/routes/validators"
	"github.com/go-playground/validator"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterChatMessageRoutes(se *core.ServeEvent, pbi *pocketbase.PocketBase) error {

	rootPath := constants.API_BASE_ROUTE + "/chatMessages"
	cmh := new(handlers.ChatMessageHandler)

	se.Router.Validator = &validators.ChatMessageValidator{Validator: validator.New()}

	se.Router.POST(rootPath, func(c echo.Context) error {

		cm := new(pbModels.ChatMessage)
		if err := c.Bind(cm); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
		if err := c.Validate(cm); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		res, err := cmh.AddNewMessage(pbi.Dao(), cm)
		if err != nil {
			return err
		}

		return c.JSON(http.StatusCreated, res)
	})

	return nil
}
