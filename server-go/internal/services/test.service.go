package services

import (
	"log"

	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/models/schema"
)

type TestService struct{}

func (*TestService) CreateCollection(dao *daos.Dao) error {

	log.Printf("TRYING TO CREATE TEST COLLECTION")

	collection := &models.Collection{
		Name:       "example",
		Type:       models.CollectionTypeBase,
		ListRule:   nil,
		DeleteRule: nil,
		Schema: schema.NewSchema(
			&schema.SchemaField{
				Name:     "title",
				Type:     schema.FieldTypeText,
				Required: true,
				Unique:   true,
			},
			&schema.SchemaField{
				Name:     "user",
				Type:     schema.FieldTypeRelation,
				Required: true,
				Options: &schema.RelationOptions{
					CollectionId:  "ae40239d2bc4477",
					CascadeDelete: true,
				},
			},
		),
	}

	if err := dao.SaveCollection(collection); err != nil {
		return err
	}

	log.Println(collection)

	return nil
}

// func (*TestService) InsertTestMessage(dao *daos.Dao) {

// 	dao.
// }
