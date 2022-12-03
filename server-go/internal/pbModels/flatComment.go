package pbModels

import (
	"coliving-crew.xyz/server/internal/constants"
	"github.com/pocketbase/pocketbase/models"
)

var _ models.Model = (*FlatComment)(nil)

type FlatComment struct {
	models.BaseModel

	Flat    string `db:"flat" json:"flat" validate:"required"`     // *Flat
	Sender  string `db:"sender" json:"sender" validate:"required"` // *User
	Content string `db:"content" json:"content" validate:"required"`
}

func (m *FlatComment) TableName() string {
	return constants.FLAT_COMMENTS_COLLECTION
}
