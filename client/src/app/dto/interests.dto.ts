import { User } from './user.dto';
import { Flat } from './flat.dto';

export interface Interest {
    id?: string;
    flat: Flat;
    user: User;
    isReadyToLive: boolean;
    created?: Date;
    updated?: Date;
}
