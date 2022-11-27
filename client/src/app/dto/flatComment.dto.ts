import { User } from './user.dto';
import { Flat } from './flat.dto';

export interface FlatComment {
    id?: string;
    flat: Flat;
    user: User;
    content: string;
    created?: Date;
    updated?: Date;
}
