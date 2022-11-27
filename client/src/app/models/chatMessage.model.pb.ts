import { BaseModelPb } from "./base.model.pb";

export interface ChatMessagesPb extends BaseModelPb {
    chat: string;
    sender: string;
    content: string;
}
