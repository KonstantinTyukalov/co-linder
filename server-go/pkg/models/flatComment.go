package models

import (
	"github.com/pocketbase/pocketbase/models"
)

var _ models.Model = (*FlatComment)(nil)

type FlatComment struct {
	models.BaseModel

	Flat    string `db:"flat" json:"flat"`     // *Flat
	Sender  string `db:"sender" json:"sender"` // *User
	Content string `db:"content" json:"content"`
}

func (m *FlatComment) TableName() string {
	return "flatComments"
}
