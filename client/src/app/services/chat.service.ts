import { Injectable } from "@angular/core";
import { Flat } from "../dto/flat.dto";
import { User } from "../dto/user.dto";
import { Chat } from "../dto/chat.dto";
import { PocketBaseService } from "./pb.service";
import { ChatMessage } from "../dto/chatMessage.dto";
import { Logger } from "../utils/logger";
import { expandAvatar } from "./user.service";
import { RecordSubscription } from "pocketbase";
import { Store } from "@ngrx/store";
import { updateChat } from "../store/actions/chat.actions";
import { chat } from "../store/selectors/chat.selectors";

function mapToChat(chat: any): Chat {
    const result = {
        ...chat,
        users: chat.expand?.users?.map((user: User) => expandAvatar(user)),
        messages: chat.expand?.messages
    }
    delete result.expand;

    console.log("Mapped chat: ", result)
    return result;
}

@Injectable()
export class ChatService {
    constructor(private pbService: PocketBaseService, private store: Store) {
    }

    async getChatWithMessageSendersAvatars(targetUserId: string): Promise<Chat> {

        console.log('targetUserId in getChatWithMessageSendersAvatars = ', targetUserId)
        const chat = await this.tryGetChatWithUser(targetUserId)

        console.log("GOT CHAT WITH TARGET USER ", chat)

        const mappedChat = mapToChat(chat)

        const allMessages = await this.pbService.PocketBaseInstance.collection('chatMessages').getFullList() as ChatMessage[]

        console.log('ALL MESSAGES', allMessages)

        const chatMessages = allMessages.filter(m => m.chat === chat.id)

        console.log('CHAT MESSAGES', chatMessages)

        const data = {
            ...mappedChat,
            messages: chatMessages
        }

        if (chatMessages) {
            const expandedMessages = []
            for (const message of chatMessages) {
                const messageSenderId = message.sender as unknown as string
                const sender = await this.pbService.PocketBaseInstance.collection('users').getOne(messageSenderId) as User;

                const expandedMessage = {
                    ...message,
                    sender: expandAvatar(sender)
                }

                expandedMessages.push(expandedMessage);
            }

            data.messages = expandedMessages
        }

        console.log('Chat with message avatars: ', data)

        this.subscribeToChatMessages(mappedChat.id!)

        return data;
    }

    async tryGetChatWithUser(targetUserId: string): Promise<Chat> {
        const chatsCollection = this.pbService.PocketBaseInstance.collection('chats')
        const currentUser = this.pbService.PocketBaseInstance.authStore.model as unknown as User;

        console.log("Current user: ", currentUser)
        const chatsList = await chatsCollection.getFullList(300, {
            expand: 'users'
        }) as Chat[]

        console.log("Chats list ", chatsList)

        const filtered = chatsList?.filter((chat: any) => {
            console.log("Checking chat", chat)
            const userIds = chat.users

            console.log(userIds)
            const isCurrentUserPresent = chat.users?.includes(currentUser.id)
            const isTargetUserPresent = chat.users?.includes(targetUserId)
            console.log(isCurrentUserPresent, isTargetUserPresent)
            return isCurrentUserPresent && isTargetUserPresent
        })

        console.log("Filtered chats list ", filtered)

        if (filtered && filtered.length) {
            return filtered[0]
        }

        console.log("No available chats found. Trying to create new.")

        console.log("Getting user by Id ", targetUserId)

        const targetUser = await this.pbService.PocketBaseInstance.collection('users').getOne(targetUserId) as User

        const createdChat = await this.createChatWithUser(currentUser, targetUser)

        return createdChat;
    }

    async createChatWithUser(loggedInUser: User, targetUser: User): Promise<Chat> {
        console.log('Trying to create chat between ', loggedInUser, ' and ', targetUser)

        const res = await this.pbService.PocketBaseInstance.collection('chats').create({ name: `${loggedInUser.name} - ${targetUser.name}`, users: [loggedInUser.id, targetUser.id] }) as Chat

        console.log("Successfully created chat with: ", loggedInUser, ' and ', targetUser)

        return res
    }

    private async getMessageWithPicture(message: ChatMessage): Promise<ChatMessage> {
        const senderId = (message.sender) as unknown as string

        const sender = await this.pbService.PocketBaseInstance.collection('users').getOne(senderId) as User

        const expandedAvatar = expandAvatar(sender);

        const data: ChatMessage = {
            ...message,
            sender: expandedAvatar
        }

        return data
    }

    async subscribeToChatMessages(chatId: string) {
        const user = this.pbService.PocketBaseInstance.authStore.model;

        this.pbService.PocketBaseInstance.collection('chatMessages').subscribe("*", async (data: RecordSubscription<ChatMessage>) => {
            console.log("Got message " + data.action + " in chat " + data.record.chat + ": " + data.record.content)
            if (data.action == "create" && data.record.chat == chatId) {
                const message = await this.getMessageWithPicture(data.record)

                this.store.dispatch(updateChat({ chatMessage: message }));
            }
        })

        console.log('Subscribed to chatMessages for ' + chatId + ' chatId', user);

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

    // Not working
    async leaveChat() {
        const chatCollection = this.pbService.PocketBaseInstance.collection('chats');
        console.log('Leaving all chats')
        chatCollection.unsubscribe();
    }
}