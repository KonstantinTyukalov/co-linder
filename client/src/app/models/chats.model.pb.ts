import { BaseModelPb } from "./base.model.pb";
import { ChatMessagesPb } from "./chatMessage.model.pb";
import { UserPb } from "./user.model.pb";

export interface ChatPb extends BaseModelPb {
    name: string;
    users: string[];
    messages: string[];
    expand?: {
        users?: UserPb[]
        messages?: ChatMessagesPb[]
    }
}
