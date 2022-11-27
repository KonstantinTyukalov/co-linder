import { BaseModelPb } from "./base.model.pb";

export interface ChatPb extends BaseModelPb {
    name: string;
    users: string[];
    messages: string[];
}
