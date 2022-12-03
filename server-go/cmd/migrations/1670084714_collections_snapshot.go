package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

// Auto generated migration with the most recent collections configuration.
func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `[
			{
				"id": "_pb_users_auth_",
				"created": "2022-11-25 09:57:06.698Z",
				"updated": "2022-11-27 13:36:43.531Z",
				"name": "users",
				"type": "auth",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "r4averci",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": 5,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "users_avatar",
						"name": "avatar",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [
								"image/jpg",
								"image/jpeg",
								"image/png",
								"image/svg+xml",
								"image/gif"
							],
							"thumbs": null
						}
					},
					{
						"system": false,
						"id": "b7z8jbdt",
						"name": "birthDate",
						"type": "date",
						"required": false,
						"unique": false,
						"options": {
							"min": "",
							"max": ""
						}
					},
					{
						"system": false,
						"id": "dp6ycpgo",
						"name": "isWoman",
						"type": "bool",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "1fw1pigx",
						"name": "country",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": 2,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "tz0lf6oz",
						"name": "langs",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "bbtjdabs",
						"name": "hasPets",
						"type": "bool",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "80byxgjm",
						"name": "aboutMyself",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "id = @request.auth.id",
				"deleteRule": "id = @request.auth.id",
				"options": {
					"allowEmailAuth": true,
					"allowOAuth2Auth": true,
					"allowUsernameAuth": true,
					"exceptEmailDomains": null,
					"manageRule": null,
					"minPasswordLength": 8,
					"onlyEmailDomains": null,
					"requireEmail": false
				}
			},
			{
				"id": "mifsewqsobt4qsh",
				"created": "2022-11-25 11:10:22.600Z",
				"updated": "2022-11-28 00:56:00.371Z",
				"name": "flats",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "ifmtz2kt",
						"name": "externalUrl",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "bkovu3qo",
						"name": "photo",
						"type": "file",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 10,
							"maxSize": 5242880,
							"mimeTypes": [
								"image/jpg",
								"image/jpeg",
								"image/png",
								"image/svg+xml",
								"image/gif"
							],
							"thumbs": []
						}
					},
					{
						"system": false,
						"id": "hh274wh3",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": 5,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "povlkcku",
						"name": "owner",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"collectionId": "_pb_users_auth_",
							"cascadeDelete": true
						}
					},
					{
						"system": false,
						"id": "4rmqnzdz",
						"name": "area",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "rzkpgi9d",
						"name": "cost",
						"type": "number",
						"required": true,
						"unique": false,
						"options": {
							"min": 0,
							"max": null
						}
					},
					{
						"system": false,
						"id": "ejbrimbg",
						"name": "description",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": 10,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "ates18om",
						"name": "capacity",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": 0,
							"max": null
						}
					},
					{
						"system": false,
						"id": "74jai9r1",
						"name": "interestedUsers",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": null,
							"collectionId": "_pb_users_auth_",
							"cascadeDelete": false
						}
					},
					{
						"system": false,
						"id": "t2hbykc6",
						"name": "readyToLiveUsers",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": null,
							"collectionId": "_pb_users_auth_",
							"cascadeDelete": false
						}
					},
					{
						"system": false,
						"id": "mrn6px3t",
						"name": "comments",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": null,
							"collectionId": "7mwgp5r03kpxg58",
							"cascadeDelete": false
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {}
			},
			{
				"id": "7mwgp5r03kpxg58",
				"created": "2022-11-25 13:57:54.968Z",
				"updated": "2022-11-28 12:51:59.731Z",
				"name": "flatComments",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "dmdmbet3",
						"name": "flat",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"collectionId": "mifsewqsobt4qsh",
							"cascadeDelete": true
						}
					},
					{
						"system": false,
						"id": "vltpnzam",
						"name": "sender",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"collectionId": "_pb_users_auth_",
							"cascadeDelete": true
						}
					},
					{
						"system": false,
						"id": "0b9fssou",
						"name": "content",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {}
			},
			{
				"id": "wmldf4gsvsydsm6",
				"created": "2022-11-25 16:50:22.596Z",
				"updated": "2022-11-26 00:39:52.651Z",
				"name": "chats",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "ofpxup8r",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "ml8vavc6",
						"name": "users",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": null,
							"collectionId": "_pb_users_auth_",
							"cascadeDelete": false
						}
					},
					{
						"system": false,
						"id": "b2x3znjd",
						"name": "messages",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": null,
							"collectionId": "rc6bu9l69b0cuip",
							"cascadeDelete": false
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {}
			},
			{
				"id": "rc6bu9l69b0cuip",
				"created": "2022-11-25 16:55:33.934Z",
				"updated": "2022-11-26 01:42:43.895Z",
				"name": "chatMessages",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "v7dqciyv",
						"name": "chat",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"collectionId": "wmldf4gsvsydsm6",
							"cascadeDelete": false
						}
					},
					{
						"system": false,
						"id": "xny1j6hq",
						"name": "sender",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"collectionId": "_pb_users_auth_",
							"cascadeDelete": false
						}
					},
					{
						"system": false,
						"id": "mzc4v22p",
						"name": "content",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {}
			},
			{
				"id": "1h4ft82wqg594wc",
				"created": "2022-12-03 16:25:14.438Z",
				"updated": "2022-12-03 16:25:14.438Z",
				"name": "example",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "8s0gsf3h",
						"name": "title",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "brj8npcs",
						"name": "user",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": null,
							"collectionId": "ae40239d2bc4477",
							"cascadeDelete": true
						}
					}
				],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			}
		]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		// no revert since the configuration on the environment, on which
		// the migration was executed, could have changed via the UI/API
		return nil
	})
}
