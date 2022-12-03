package pbModels

import (
	"coliving-crew.xyz/server/internal/constants"
	"github.com/pocketbase/pocketbase/models"
)

var _ models.Model = (*Chat)(nil)

type Chat struct {
	models.BaseModel

	Name     string   `db:"name" json:"name"`
	Users    []string `db:"users" json:"users"` // []*User
	Messages []string `db:"messages" json:"messages"`
}

func (m *Chat) TableName() string {
	return constants.CHATS_COLLECTION // the name of your collection
}
