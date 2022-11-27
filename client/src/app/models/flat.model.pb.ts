import { BaseModelPb } from './base.model.pb';
import { FlatCommentPb } from './flatComment.model.pb';
import { UserPb } from './user.model.pb';

export interface FlatPb extends BaseModelPb {
    externalUrl: string;
    name: string;
    owner: string;
    area: string;
    cost: number;
    description: string;
    capacity: number;
    interestedUsers: string[];
    readyToLiveUsers: string[];
    comments: string[];
    expand?: {
        owner?: UserPb;
        interestedUsers?: UserPb[];
        readyToLiveUsers?: UserPb[];
        comments?: FlatCommentPb[];
    };
}
