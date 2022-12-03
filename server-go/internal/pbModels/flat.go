package pbModels

import (
	"coliving-crew.xyz/server/internal/constants"
	"github.com/pocketbase/pocketbase/models"
)

var _ models.Model = (*Flat)(nil)

type Flat struct {
	models.BaseModel

	ExternalUrl string   `db:"externalUrl" json:"externalUrl"`
	Photo       string   `db:"photo" json:"photo"`
	Name        string   `db:"name" json:"name"`
	Owner       string   `db:"owner" json:"owner"` // *User
	Area        string   `db:"area" json:"area"`
	Cost        uint     `db:"cost" json:"cost"`
	Description string   `db:"description" json:"description"`
	Comments    []string `db:"comments" json:"comments"`
}

func (m *Flat) TableName() string {
	return constants.FLATS_COLLECTION
}
