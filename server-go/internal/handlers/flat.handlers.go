package handlers

import (
	"log"

	"coliving-crew.xyz/server/internal/constants"
	"coliving-crew.xyz/server/internal/pbModels"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
)

type FlatHandler struct{}

func (hf *FlatHandler) AddNewComment(dao *daos.Dao, fc *pbModels.FlatComment) (*pbModels.FlatComment, error) {

	resultCommentRecord := &pbModels.FlatComment{}

	if transactionErr := dao.RunInTransaction(func(txDao *daos.Dao) error {
		flatCommentsCollection, articlesCollectionErr := txDao.FindCollectionByNameOrId(constants.FLAT_COMMENTS_COLLECTION)

		if articlesCollectionErr != nil {
			return articlesCollectionErr
		}

		fcRecord := models.NewRecord(flatCommentsCollection)
		fcRecord.Set("flat", fc.Flat)
		fcRecord.Set("sender", fc.Sender)
		fcRecord.Set("content", fc.Content)

		log.Println("FLAT COMMENT RECORD BEFORE SAVE", fcRecord)

		if fcSaveErr := dao.SaveRecord(fcRecord); fcSaveErr != nil {
			return fcSaveErr
		}

		log.Println("FLAT COMMENT RECORD AFTER SAVE", fcRecord)

		flatId := fc.Flat

		flatRecord, flatErr := dao.FindRecordById("flats", flatId)

		if flatErr != nil {
			return flatErr
		}

		comments := flatRecord.Get("comments").([]string)

		log.Println("COMMENTS", comments)

		flatRecord.Set("comments", append(comments, fcRecord.Id))

		if err := dao.SaveRecord(flatRecord); err != nil {
			return err
		}

		if err := dao.FindById(resultCommentRecord, fcRecord.Id); err != nil {
			return err
		}

		return nil

	}); transactionErr != nil {
		return nil, transactionErr
	}

	return resultCommentRecord, nil
}
