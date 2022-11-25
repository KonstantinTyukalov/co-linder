import { User } from "./user.dto";
import { Flat } from "./flat.dto";

export interface Chat {
    id?: string;
    flat: Flat;
    user: User;
    message: string;
    created: Date;
    updated: Date;
}