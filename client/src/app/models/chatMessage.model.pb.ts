import { BaseModelPb } from "./base.model.pb";
import { ChatPb } from "./chats.model.pb";
import { UserPb } from "./user.model.pb";

export interface ChatMessagesPb extends BaseModelPb {
    chat: string;
    sender: string;
    content: string;
    expand?: {
        sender?: UserPb
        chat?: ChatPb
    }
}
