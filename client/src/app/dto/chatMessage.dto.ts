import { Chat } from './chat.dto';
import { User } from './user.dto';

export interface ChatMessage {
    id?: string;
    content: string;
    sender: User;
    chat: Chat;
    created?: Date;
    updated?: Date;
}
