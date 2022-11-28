import { Injectable } from '@angular/core';
import { User } from '../dto/user.dto';
import { Chat } from '../dto/chat.dto';
import { PocketBaseService } from './pb.service';
import { ChatMessage } from '../dto/chatMessage.dto';
import { expandAvatar, ghostUser } from './user.service';
import { RecordSubscription } from 'pocketbase';
import { Store } from '@ngrx/store';
import { updateChatMessages } from '../store/actions/chat.actions';
import { ChatPb } from '../models/chats.model.pb';
import { UserPb } from '../models/user.model.pb';
import { ChatMessagesPb } from '../models/chatMessage.model.pb';

function mapToChat(chatPb: ChatPb): Chat {

    const { expand, ...chat } = chatPb

    const mappedChatUsers: User[] = expand?.users?.map((user: User) => expandAvatar(user)) ?? []

    const mappedChatMessages: ChatMessage[] =
        expand?.messages?.map(msg => {
            const sender = mappedChatUsers.find(u => u.id === msg.sender)

            if (sender) {
                return {
                    ...msg,
                    sender
                } as ChatMessage
            }

            return {
                ...msg,
                sender: ghostUser
            } as ChatMessage
        }) ?? []

    const result: Chat = {
        ...chat,
        users: mappedChatUsers,
        messages: mappedChatMessages
    };

    console.log('Mapped chat: ', result);
    return result;
}

@Injectable()
export class ChatService {
    constructor(private readonly pbService: PocketBaseService, private readonly store: Store) {
    }

    async getChatById(chatId: string): Promise<Chat> {
        const chatsCollection = this.pbService.getCollection('chats');

        const chat = await chatsCollection.getOne(chatId, {
            expand: 'users,messages'
        }) as ChatPb;

        console.log('GOT CHAT FROM DB ', chat)

        const mappedChat = mapToChat(chat);

        this.subscribeToChatUpdates(chat.id!);

        return mappedChat;
    }

    async tryGetChatWithUser(currentUser: User, targetUserId: string): Promise<Chat> {
        const chatsCollection = this.pbService.getCollection('chats');

        console.log('Current user: ', currentUser);

        const chatsList = await chatsCollection.getFullList(undefined, {
            expand: 'users'
        }) as ChatPb[];

        console.log('Chats list ', chatsList);

        const existedChat = chatsList?.find((chat) => {
            console.log('Checking chat', chat);
            const userIds = chat.users;
            console.log(userIds);
            const isCurrentUserPresent = chat.users?.includes(currentUser.id!);
            const isTargetUserPresent = chat.users?.includes(targetUserId);
            console.log(isCurrentUserPresent, isTargetUserPresent);
            return isCurrentUserPresent && isTargetUserPresent;
        });

        if (existedChat) {
            console.log('Found chat with user ', existedChat);
            return existedChat as unknown as Chat;
        }

        console.log('No available chats found. Trying to create new.');

        console.log('Getting user by Id ', targetUserId);

        const targetUser = await this.pbService.getCollection('users').getOne(targetUserId) as UserPb;

        const createdChat = await this.createChatWithUser(currentUser, targetUser);

        return createdChat as unknown as Chat;
    }

    async subscribeToChatUpdates(chatId: string) {
        this.pbService.getCollection('chats').subscribe(chatId, async (updatedChatRecord: RecordSubscription<ChatPb>) => {
            console.log(`Got ${updatedChatRecord.action} for chat ` + updatedChatRecord.record.id);

            if (updatedChatRecord.action === 'update') {
                const chatMessages = updatedChatRecord.record.messages

                const lastMessageId = chatMessages.pop();

                if (lastMessageId) {
                    const lastMessage = await this.pbService.getCollection('chatMessages').getOne(lastMessageId!) as ChatMessagesPb;

                    const fullLastMessage = await this.getMessageWithPicture(lastMessage);
                    this.store.dispatch(updateChatMessages({ lastChatMessage: fullLastMessage }));
                }
            }
        });

        console.log('Subscribed to chatMessages for chat ' + chatId);

        return true;
    }

    async getAllChatsByUserId(userId: string): Promise<Chat[]> {
        const chatCollection = this.pbService.getCollection('chats');

        const allChats = await chatCollection.getFullList(undefined, {
            expand: 'users'
        }) as ChatPb[];

        const userChats = allChats.filter((record: any) => record.users.includes(userId));

        console.log('USER CHATS', userChats);

        const expandedChats = userChats as unknown as Chat[];

        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const userChat in userChats) {
            const expandedUsers: User[] = [];
            const chatParticipants = userChats[userChat].expand?.users;

            if (chatParticipants) {
                for (const participant of chatParticipants) {
                    const participantWithAvatar = expandAvatar(participant);
                    expandedUsers.push(participantWithAvatar);
                }
            }
            expandedChats[userChat].users = expandedUsers;
        }

        console.log('EXPANDED CHATS', userChats);

        return expandedChats as unknown as Chat[];
    }

    async sendMessage(message: ChatMessage) {
        const chatMessagesCollection = this.pbService.getCollection('chatMessages');
        const chatCollection = this.pbService.getCollection('chats');

        const chatId = message.chat.id!;

        const newMessage: ChatMessagesPb = {
            content: message.content,
            sender: message.sender.id!,
            chat: chatId
        };
        console.log('Trying to create new chat message: ', newMessage);

        const newMessageInCollection = await chatMessagesCollection.create(newMessage) as ChatMessagesPb
        console.log('Added new chat message ', newMessageInCollection.id);

        console.log('Trying to update chat: ', chatId);

        const chat = await chatCollection.getOne(chatId) as ChatPb;

        const newChatState: ChatPb = {
            ...chat,
            messages: [
                ...chat.messages,
                newMessageInCollection.id!
            ]
        };

        const updatedChat = await chatCollection.update(chatId, newChatState);

        console.log('Successfully updated chat: ', updatedChat.id);

        return newMessageInCollection;
    }

    // Not working
    async leaveChat() {
        const chatCollection = this.pbService.getCollection('chats');
        console.log('Leaving all chats');
        chatCollection.unsubscribe();
    }

    private async createChatWithUser(loggedInUser: User, targetUser: User): Promise<ChatPb> {
        console.log('Trying to create chat between ', loggedInUser, ' and ', targetUser);

        const newChat: ChatPb = {
            name: `${loggedInUser.name}, ${targetUser.name}`,
            users: [loggedInUser.id!, targetUser.id!],
            messages: []
        }

        const res = await this.pbService.getCollection('chats').create(newChat) as ChatPb;

        console.log('Successfully created chat with: ', loggedInUser, ' and ', targetUser);

        return res;
    }

    private async getMessageWithPicture(message: ChatMessagesPb): Promise<ChatMessage> {
        const senderId = message.sender

        const sender = await this.pbService.getCollection('users').getOne(senderId) as UserPb;

        const expandedAvatar = expandAvatar(sender);

        const data: ChatMessage = {
            ...message as unknown as ChatMessage,
            sender: expandedAvatar
        };

        return data;
    }
}
