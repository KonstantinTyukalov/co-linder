package handlers

import (
	"log"

	"coliving-crew.xyz/server/internal/constants"
	"coliving-crew.xyz/server/internal/pbModels"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
)

type ChatMessageHandler struct{}

func (cmh *ChatMessageHandler) AddNewMessage(dao *daos.Dao, cm *pbModels.ChatMessage) (*pbModels.ChatMessage, error) {
	resultMessageRecord := &pbModels.ChatMessage{}

	chatMessageCollection, collectionErr := dao.FindCollectionByNameOrId(constants.CHAT_MESSAGES_COLLECTION)
	if collectionErr != nil {
		return nil, collectionErr
	}

	fcRecord := models.NewRecord(chatMessageCollection)
	fcRecord.Set("chat", cm.Chat)
	fcRecord.Set("sender", cm.Sender)
	fcRecord.Set("content", cm.Content)

	if err := dao.RunInTransaction(func(txDao *daos.Dao) error {

		log.Println("Saving chat message...", fcRecord)

		if recordSaveErr := dao.SaveRecord(fcRecord); recordSaveErr != nil {
			return recordSaveErr
		}

		chatId := cm.Chat
		chatRecord, findRecordErr := dao.FindRecordById(constants.CHATS_COLLECTION, chatId)
		if findRecordErr != nil {
			return findRecordErr
		}

		messages := chatRecord.Get("messages").([]string)
		chatRecord.Set("messages", append(messages, fcRecord.Id))

		if err := dao.SaveRecord(chatRecord); err != nil {
			return err
		}

		return nil
	}); err != nil {
		return nil, err
	}

	// TODO: Not to make another call after inserting
	if err := dao.FindById(resultMessageRecord, fcRecord.Id); err != nil {
		return nil, err
	}

	return resultMessageRecord, nil
}
