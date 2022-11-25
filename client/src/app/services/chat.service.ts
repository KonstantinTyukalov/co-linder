import { Injectable } from "@angular/core";
import { Flat } from "../dto/flat.dto";
import { User } from "../dto/user.dto";
import { Chat } from "../dto/chat.dto";
import { PocketBaseService } from "./pb.service";
import { ChatMessage } from "../dto/chatMessage.dto";

@Injectable()
export class ChatService {
    constructor(private pbService: PocketBaseService) {
    }

    async createChatWithUser(loggedInUser: User, targetUser: User): Promise<Chat> {
        console.log('Trying to create chat between ', targetUser.name, ' and ', loggedInUser.name)

        const res = await this.pbService.PocketBaseInstance.collection('chats').create({ users: [loggedInUser, targetUser] }) as Chat

        console.log("Successfully created chat with: ", targetUser.name, ' and ', loggedInUser.name)

        return res
    }

    async enterTheChat(loggedInUser: User, chat: Chat) {
        const chatCollection = this.pbService.PocketBaseInstance.collection('chats');
        const chatData = await chatCollection.getOne(chat.id!) as Chat;

        const users = [
            ...chatData.users,
            loggedInUser
        ]

        const newChatData = {
            ...chatData,
            users
        }

        console.log("Trying to update chat. new data: ", newChatData)

        const res = await this.pbService.PocketBaseInstance.collection('chats').update(chat.id!, newChatData)

        console.log('Successfully updated chat. New info: ', res);

        return true;
    }

    async sendMessage(message: ChatMessage) {
        const chatMessagesCollection = this.pbService.PocketBaseInstance.collection('chatsMessage');

        const res = await chatMessagesCollection.create(message)
        console.log('Added new chat message ', res)

        return res;
    }
}