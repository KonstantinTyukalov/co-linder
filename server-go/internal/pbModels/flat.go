package pbModels

import (
	"github.com/pocketbase/pocketbase/models"
)

var _ models.Model = (*Flat)(nil)

type Flat struct {
	models.BaseModel

	ExternalUrl string `db:"externalUrl" json:"externalUrl"`
	Photo       string `db:"photo" json:"photo"`
	Name        string `db:"name" json:"name"`
	Owner       string `db:"owner" json:"owner"` // *User
	Area        string `db:"area" json:"area"`
	Cost        uint   `db:"cost" json:"cost"`
	Description string `db:"description" json:"description"`
}

func (m *Flat) TableName() string {
	return "flats" // the name of your collection
}
