import { Injectable } from "@angular/core";
import { Flat } from "../dto/flat.dto";
import { User } from "../dto/user.dto";
import { Chat } from "../dto/chat.dto";
import { PocketBaseService } from "./pb.service";
import { ChatMessage } from "../dto/chatMessage.dto";
import { Logger } from "../utils/logger";
import { expandAvatar } from "./user.service";

function mapToChat(chat: any): Chat {
    const result = {
        ...chat,
        users: chat.expand?.users?.map((user: User) => expandAvatar(user)),
        messages: chat.expand?.messages
    }
    delete result.expand;
    return result;
}

@Injectable()
export class ChatService {
    constructor(private pbService: PocketBaseService) {
    }

    async createChatWithUser(loggedInUserId: string, targetUserId: string): Promise<Chat> {
        console.log('Trying to create chat between ', loggedInUserId, ' and ', targetUserId)

        const res = await this.pbService.PocketBaseInstance.collection('chats').create({ users: [loggedInUserId, targetUserId] }) as Chat

        console.log("Successfully created chat with: ", loggedInUserId, ' and ', targetUserId)

        return res
    }

    async enterTheChat(loggedInUser: User, chat: Chat) {
        const chatCollection = this.pbService.PocketBaseInstance.collection('chats');
        const chatData = await chatCollection.getOne(chat.id!) as Chat;

        const users = [
            ...chatData.users!,
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

    async getChatsByUserId(userId: string) {
        const chatCollection = this.pbService.PocketBaseInstance.collection('chats');

        const res = (await chatCollection.getFullList())
            .filter((record: any) => record.users.includes(userId))

        Logger.SuccessfulQueryLog(res)

        return res as unknown as Chat[];
    }

    async sendMessage(message: ChatMessage) {
        const chatMessagesCollection = this.pbService.PocketBaseInstance.collection('chatMessages');

        const newMessage = {
            "content": message.content,
            "sender": message.sender.id,
            "chat": message.chat.id
        }
        console.log('Trying to create new chat message: ', newMessage)

        const res = await chatMessagesCollection.create(newMessage)
        console.log('Added new chat message ', res)

        return res;
    }

    async getChatById(chatId: string): Promise<Chat> {
        const chatCollection = this.pbService.PocketBaseInstance.collection('chats');

        const res = await chatCollection.getOne(chatId, {
            expand: 'users,messages'
        })
        Logger.SuccessfulQueryLog(res)

        return mapToChat(res);
    }

    // Not working
    async leaveChat(useId: string, chatIdToLeave: string) {
        const chatCollection = this.pbService.PocketBaseInstance.collection('chats');

        const chat = await chatCollection.getOne(chatIdToLeave) as any;

        console.log('Got chat ', chat)

        const newChatState = {
            users: [
                chat.users?.filter((uId: any) => uId !== useId)
            ],
            messages: [
                ...chat.messages
            ]
        };

        console.log('Trying to update chat ', newChatState)

        const res = await chatCollection.update(chatIdToLeave, newChatState)

        Logger.SuccessfulQueryLog(res);
    }
}