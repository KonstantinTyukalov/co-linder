import { Injectable } from "@angular/core";
import { User } from "src/app/dto/user.dto";
import { Flat } from "src/app/dto/flat.dto";
import { pbService } from "./pb.service";

export interface FilterFlat {
    withPhoto?: boolean
    name?: string // substring
    owner?: User
    area?: string // substring
    costMin?: number
    costMax?: number
    capacityMin?: number
    capacityMax?: number
    description?: string // substring
    createdMin?: Date // like "not older 1 month"
    capacityReadyMin?: number // full of people min (more chance to book soon), unsupported yet
    capacityReadyMax?: number // there are places at least (find for group of people), unsupported yet. If = 0, It's first will be the first list
}

@Injectable()
export class FlatService {
    readonly PER_PAGE = 20;

    constructor() {
    }

    async createFlat(flat: Flat): Promise<Flat> {
        console.log('Trying to create flat', flat);
        return await pbService.PocketBaseInstance.collection('flats').create(flat);
    }

    async updateFlat(flat: Flat): Promise<Flat> {
        console.log('Trying to update flat', flat);
        return await pbService.PocketBaseInstance.collection('flats').update(flat.id, flat);
    }

    async getFlatById(id: string): Promise<Flat> {
        console.log('Trying to get flat by id:', id);
        return await pbService.PocketBaseInstance.collection('flats').getOne(id);
    }

    async getFlatCommentsById(id: string): Promise<Flat> {
        console.log('Trying to get flat by id:', id);
        return await pbService.PocketBaseInstance.collection('flatComments').getOne(id);
    }

    async getFlats(): Promise<Flat[]> {
        console.log('Trying to get flast');
        return await pbService.PocketBaseInstance.collection('flats').getFullList(200);
    }

    async searchFlat(page: number, filter: FilterFlat) { // TODO
        let filterStr: string = ""
        if (filter.withPhoto) filterStr += "photo > 1";
        if (filter.owner) filterStr += "owner ~ " + filter.owner.id;
        if (filter.area) filterStr += "area ~ " + filter.area;
        if (filter.costMin || filter.costMax) {
            if (filter.costMin)
                filterStr += "name ~ " + filter.name;
        }
        if (filter.name) filterStr += "name ~ " + filter.name;
        if (filter.name) filterStr += "name ~ " + filter.name;
        if (filter.name) filterStr += "name ~ " + filter.name;
        console.log('Looking flats with', filterStr);
        return await pbService.PocketBaseInstance.collection('flats').getList(
            page,
            this.PER_PAGE,
            {
                "filter": filterStr,
                "sort": '-cost'
            }
        )
    }
}
