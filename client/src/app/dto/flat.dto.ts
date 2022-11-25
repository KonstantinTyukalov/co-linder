import { User } from "./user.dto";

export interface Flat {
    id?: string;
    externalUrl: string;
    photo?: File;
    name: string; // "Flat in center" or address
    owner: User;
    area: string; // city or region in city
    cost: number;
    capacity: number;
    description: string;
    created: Date;
    updated: Date;
}
