import { Injectable } from "@angular/core";
import { User } from "src/app/dto/user.dto";
import { Flat } from "src/app/dto/flat.dto";
import { PocketBaseService } from "./pb.service";
import { FlatComment } from "../dto/flatComment.dto";

export class FilterFlat {
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
    interestedMin?: number // interested people min (more chance to book soon)
    interestedMax?: number // not popular yet.
    readyToLiveMin?: number // ready to live people min (more chance to book soon, used together with capacityMin/Max)
    readyToLiveMax?: number // there are places at least (find for group of people)
}

function addAnd(str: string, suffix: string): string {
    if (str.length > 0) {
        return str + " && " + suffix
    }
    return suffix
}

@Injectable()
export class FlatService {
    readonly PER_PAGE = 20;

    constructor(private pbService: PocketBaseService) {
    }

    async createFlat(flat: Flat): Promise<Flat> {
        console.log('Trying to create flat', flat);
        return await this.pbService.PocketBaseInstance.collection('flats').create(flat);
    }

    async updateFlat(flat: Flat): Promise<Flat> {
        console.log('Trying to update flat', flat);
        return await this.pbService.PocketBaseInstance.collection('flats').update(flat.id!, flat);
    }

    async getFlatById(id: string): Promise<Flat> {
        console.log('Trying to get flat by id:', id);
        const res = await this.pbService.PocketBaseInstance.collection('flats').getOne(id, {
            expand: "interestedUsers,readyToLiveUsers"
        }) as any;

        const flat: Flat = {
            ...res,
            downloadedPhotos: res['photo'] as string[]
        }

        return flat
    }

    async getFlatCommentsById(flat: Flat): Promise<FlatComment[]> {
        console.log('Trying to get flat by id:', flat);
        const result = await this.pbService.PocketBaseInstance.collection('flatComments').getFullList(200, {
            filter: `flat = ${flat.id}`,
        })
        return result as unknown as Promise<FlatComment[]>;
    }

    async addFlatComment(flatComment: FlatComment): Promise<FlatComment> {
        console.log('Trying add flat comment', flatComment);
        return await this.pbService.PocketBaseInstance.collection('flatComments').create(flatComment);
    }

    async getFlats(): Promise<Flat[]> {
        console.log('Trying to get flats');
        return await this.pbService.PocketBaseInstance.collection('flats').getFullList(200, {
            expand: "interestedUsers,readyToLiveUsers"
        });
    }

    async searchFlat(page: number, filter: FilterFlat) {
        let filterStr: string = ""
        if (filter.withPhoto) filterStr = addAnd(filterStr, "photo > 1");
        if (filter.owner) filterStr = addAnd(filterStr, "owner ~ \"" + filter.owner.id + "\"");
        if (filter.area) filterStr = addAnd(filterStr, "area ~ \"" + filter.area + "\"");
        if (filter.costMin) filterStr = addAnd(filterStr, "cost >= " + filter.costMin);
        if (filter.costMax) filterStr = addAnd(filterStr, "cost <= " + filter.costMax);
        if (filter.capacityMin) filterStr = addAnd(filterStr, "capacity >= " + filter.capacityMin);
        if (filter.capacityMax) filterStr = addAnd(filterStr, "capacity <= " + filter.capacityMax);
        if (filter.description) filterStr = addAnd(filterStr, "description ~ \"" + filter.description + "\"");
        if (filter.createdMin) filterStr = addAnd(filterStr, "created < \"" + filter.createdMin + "\"");
        //cost < 1500 && 
        if (filter.interestedMin) filterStr = addAnd(filterStr, "created < \"" + filter.createdMin + "\"");
        if (filter.readyToLiveMin) filterStr = addAnd(filterStr, "created < \"" + filter.createdMin + "\"");
        // TODO relations and filters for them capacityReadyMin
        console.log('Looking flats with', filterStr);
        const result = await this.pbService.PocketBaseInstance.collection('flats').getList(
            page,
            this.PER_PAGE,
            {
                "filter": filterStr,
                "sort": '-cost',
                "expand": "interestedUsers,readyToLiveUsers"
            }
        )

        return result;
    }
}
