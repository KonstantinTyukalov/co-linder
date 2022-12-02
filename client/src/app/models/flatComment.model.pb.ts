import { BaseModelPb } from './base.model.pb';
import { FlatPb } from './flat.model.pb';
import { UserPb } from './user.model.pb';

export interface FlatCommentPb extends BaseModelPb {
    flat: string;
    sender: string;
    content: string;
    expand?: {
        flat?: FlatPb;
        sender?: UserPb;
    };
}
