import { Chat } from '@dto/chat.dto';
import { ChatMessage } from '@dto/chatMessage.dto';
import { User } from '@dto/user.dto';
import { ChatPb } from '@models/chats.model.pb';
import { expandAvatar, ghostUser } from '@services/user.service';

export const mapToChat = (chatPb: ChatPb): Chat => {
    const { expand, ...chat } = chatPb;

    const mappedChatUsers: User[] = expand?.users?.map((user: User) => expandAvatar(user)) ?? [];

    const mappedChatMessages: ChatMessage[] =
        expand?.messages?.map(msg => {
            const sender = mappedChatUsers.find(u => u.id === msg.sender);

            if (sender) {
                return {
                    ...msg,
                    sender
                } as ChatMessage;
            }

            return {
                ...msg,
                sender: ghostUser
            } as ChatMessage;
        }) ?? [];

    const result: Chat = {
        ...chat,
        users: mappedChatUsers,
        messages: mappedChatMessages
    };

    console.log('Mapped chat: ', result);
    return result;
};
