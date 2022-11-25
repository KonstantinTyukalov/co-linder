import { ChatMessage } from "./chatMessage.dto";
import { User } from "./user.dto";

export interface Chat {
    id?: string;
    users?: User[];
    userIds?: string[]
    messages?: ChatMessage[]
    created?: Date;
    updated?: Date;
}
