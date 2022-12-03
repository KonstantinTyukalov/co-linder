package services

import (
	"log"

	"coliving-crew.xyz/server/internal/pbModels"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
)

type ChatService struct{}

func ChatQuery(dao *daos.Dao) *dbx.SelectQuery {
	return dao.ModelQuery(&pbModels.Chat{})
}

func GetChatMessagesByChatId(dao *daos.Dao, chatId string) ([]*pbModels.ChatMessage, error) {
	chatMessages := []*pbModels.ChatMessage{}

	err := dao.ModelQuery(&pbModels.ChatMessage{}).AndWhere(dbx.HashExp{"chat": chatId}).All(chatMessages)

	if err != nil {
		return nil, err
	}

	return chatMessages, nil
}

func GetChatById(dao *daos.Dao, chatId string) (*pbModels.Chat, error) {

	chat := &pbModels.Chat{}

	err := ChatQuery(dao).AndWhere(dbx.HashExp{"id": chatId}).Limit(1).One(chat)

	if err != nil {
		return nil, err
	}

	return chat, nil
}

func (*ChatService) SaveNewChatMessage(dao *daos.Dao, cm pbModels.ChatMessage) error {

	chatId := cm.Chat
	transactErr := dao.RunInTransaction(func(txDao *daos.Dao) error {
		chat, getChatErr := GetChatById(txDao, chatId)

		if getChatErr != nil {
			return getChatErr
		}

		log.Print(chat)

		chatMessagesCollection, err := txDao.FindCollectionByNameOrId(cm.TableName())
		if err != nil {
			return err
		}

		newChatMessageRecord := models.NewRecord(chatMessagesCollection)

		newChatMessageRecord.Set("chat", cm.Chat)
		newChatMessageRecord.Set("content", cm.Content)
		newChatMessageRecord.Set("sender", cm.Sender)

		if err := txDao.SaveRecord(newChatMessageRecord); err != nil {
			return err
		}

		newChatState, err := txDao.FindRecordById("chats", chatId)
		if err != nil {
			return err
		}

		chatMessages := []*models.Record{}

		chatMessErr := dao.
			ModelQuery(&pbModels.ChatMessage{}).
			AndWhere(dbx.HashExp{"chat": chatId}).
			All(chatMessages)

		chatMessages = append(chatMessages, newChatMessageRecord)

		if chatMessErr != nil {
			return chatMessErr
		}

		if err := txDao.SaveRecord(newChatState); err != nil {
			return err
		}

		log.Printf("ONO ZHIVOE")

		return nil
	})

	if transactErr != nil {
		return transactErr
	}

	return nil

	// err := app.Dao().RunInTransaction(func(txDao *daos.Dao) error {
	// // update a record
	// record, err := txDao.FindRecordById("articles", "RECORD_ID")
	// if err != nil {
	//     return err
	// }
	// record.Set("status", "active")
	// if err := txDao.SaveRecord(record); err != nil {
	//     return err
	// }

	// // run some custom raw query
	// query := txDao.DB().NewQuery("DELETE articles WHERE status = 'pending'")
	// if _, err := query.Execute(); err != nil {
	//     return err
	// }

	// return nil

}
