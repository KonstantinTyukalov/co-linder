import { BaseModelPb } from "./base.model.pb";

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
}
