import { User } from "./user.dto";

export interface Flat {
    id?: string;
    externalUrl?: string;
    uploadPhotos?: File[];
    downloadedPhotos?: string[];
    name: string; // "Flat in center" or address
    owner: User;
    area: string; // city or region in city
    cost: number;
    capacity: number;
    description: string;
    interestedUsers?: User[];
    readyToLiveUsers: User[];
    created?: Date;
    updated?: Date;
    expand?: {
        owner?: User;
        interestedUsers?: User[];
        readyToLiveUsers?: User[];
    }
}
