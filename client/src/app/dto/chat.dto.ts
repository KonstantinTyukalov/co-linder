import { ChatMessage } from "./chatMessage.dto";
import { User } from "./user.dto";

export interface Chat {
    id?: string;
    users: User[];
    messages: ChatMessage[]
    created?: Date;
    updated?: Date;
}
