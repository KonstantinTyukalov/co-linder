import { BaseModelPb } from "./base.model.pb";

export interface FlatCommentPb extends BaseModelPb {
    flat: string;
    user: string;
    content: string;
}
