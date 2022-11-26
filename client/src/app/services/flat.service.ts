import { Injectable } from "@angular/core";
import { User } from "src/app/dto/user.dto";
import { Flat } from "src/app/dto/flat.dto";
import { PocketBaseService, STATIC_PATH} from "./pb.service";
import { FlatComment } from "../dto/flatComment.dto";
import { Logger } from "../utils/logger";
import { expandAvatar } from "./user.service";

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

function toFilePath(id:string, fileName: string) {
    return STATIC_PATH + "flats/" + id + "/" + fileName;
}

function mapToFlat(flat: any):Flat {
    const result = {
        ...flat,
        owner: expandAvatar(flat.expand!.owner!),
        interestedUsers: flat.expand?.interestedUsers?.map((user: User) => expandAvatar(user)),
        readyToLiveUsers: flat.expand?.readyToLiveUsers?.map((user: User) => expandAvatar(user)),
        downloadedPhotos: 'photo' in flat ? flat['photo'].map((photo: string) => toFilePath(flat.id, photo)) : ""
    }
    delete result.expand;
    delete result.photo;
    return result;
}

function mapToFlatComment(comment: any):FlatComment {
    const result = {
        ...comment,
        user: expandAvatar(comment.expand!.user!),
    }
    delete result.expand;
    return result;
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
            expand: "owner,interestedUsers,readyToLiveUsers"
        });

        return mapToFlat(res);
    }

    async getFlatWithComments(id: string): Promise<Flat> {
        const flat = await this.getFlatById(id);
        const comments = await this.getFlatCommentsById(id);

        (await flat).comments = (await comments);
        return flat;
    }

    async getFlatCommentsById(flatId: string): Promise<FlatComment[]> {
        console.log('Trying to get comments for flat by id:', flatId);
        const result = await this.pbService.PocketBaseInstance.collection('flatComments').getFullList(200, {
            filter: "flat = '" + flatId + "'",
            expand: 'user',
            sort: '+created'
        })

        return (await result).map(comment => mapToFlatComment(comment));
    }

    async addFlatComment(flatComment: FlatComment): Promise<FlatComment> {
        console.log('Trying add flat comment', flatComment);
        return await this.pbService.PocketBaseInstance.collection('flatComments').create(flatComment);
    }

    async getFlats(): Promise<Flat[]> {
        console.log('Trying to get flats');
        const res = this.pbService.PocketBaseInstance.collection('flats').getFullList(200, {
            expand: "owner,interestedUsers,readyToLiveUsers"
        });
        return (await res).map(flat => mapToFlat(flat))
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
                filter: filterStr,
                sort: '-cost',
                expand: "owner,interestedUsers,readyToLiveUsers"
            }
        )

        return (await result).items.map(res => mapToFlat(res));
    }
}