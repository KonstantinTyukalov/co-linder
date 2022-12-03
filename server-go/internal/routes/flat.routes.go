package routes

import (
	"coliving-crew.xyz/server/internal/handlers"
	"coliving-crew.xyz/server/internal/pbModels"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterFlatRoutes(se *core.ServeEvent, pbi *pocketbase.PocketBase) error {

	rootPath := "/api/flat"
	transactionsPath := rootPath + "/transactions"
	fh := new(handlers.FlatHandler)

	se.Router.POST(transactionsPath+"/flatComments", func(c echo.Context) error {

		// fc := pbModels.FlatComment{
		// 	Flat:    c.FormValue("flat"),
		// 	Sender:  c.FormValue("sender"),
		// 	Content: c.FormValue("content"),
		// }

		fc := new(pbModels.FlatComment)
		if err := c.Bind(fc); err != nil {
			return err
		}

		res, err := fh.AddNewComment(pbi.Dao(), fc)

		if err != nil {
			return err
		}

		return c.JSON(200, res)
	})

	return nil
}
