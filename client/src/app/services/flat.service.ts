import { Injectable } from "@angular/core";
import { User } from "src/app/dto/user.dto";
import { Flat } from "src/app/dto/flat.dto";
import { PocketBaseService } from "./pb.service";
import { FlatComment } from "../dto/flatComment.dto";
import { expandAvatar } from "./user.service";
import { Store } from "@ngrx/store";
import { updateFlatComments } from "../store/actions/flat.actions";
import { RecordSubscription } from "pocketbase";
import * as FlatSelectors from "../store/selectors/flat.selectors"
import { take } from "rxjs/operators";
import { environment } from "../../environments/environment";

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

function toFilePath(id: string, fileName: string) {
    return environment.serverUrl + "flats/" + id + "/" + fileName;
}

function mapToFlat(flat: any): Flat {
    const result = {
        ...flat,
        owner: expandAvatar(flat.expand?.owner!),
        interestedUsers: flat.expand?.interestedUsers?.map((user: User) => expandAvatar(user)),
        readyToLiveUsers: flat.expand?.readyToLiveUsers?.map((user: User) => expandAvatar(user)),
        downloadedPhotos: 'photo' in flat ? flat['photo'].map((photo: string) => toFilePath(flat.id, photo)) : ""
    }
    delete result.expand;
    delete result.photo;
    return result;
}

function mapToFlatComment(comment: any): FlatComment {
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

    constructor(private pbService: PocketBaseService, private store: Store) {
    }

    async createFlat(flat: Flat): Promise<Flat> {
        console.log('Trying to create flat', flat);
        return await this.pbService.getCollection('flats').create(flat);
    }

    async updateFlat(flat: Flat): Promise<Flat> {
        const payload = {
            ...flat,
            owner: flat.owner.id,
            interestedUsers: flat.interestedUsers?.map(user => user?.id).filter(x => x),
            readyToLiveUsers: flat.readyToLiveUsers?.map(user => user?.id).filter(x => x)
        }
        console.log('Trying to update flat with payload', payload);
        return await mapToFlat(this.pbService.getCollection('flats').update(flat.id!, payload, {
            expand: "owner,interestedUsers,readyToLiveUsers"
        }));
    }

    async getFlatById(id: string): Promise<Flat> {
        console.log('Trying to get flat by id:', id);
        const res = await this.pbService.getCollection('flats').getOne(id, {
            expand: "owner,interestedUsers,readyToLiveUsers"
        });

        return mapToFlat(res);
    }

    async getFlatCommentsById(flatId: string): Promise<FlatComment[]> {
        console.log('Trying to get comments for flat by id:', flatId);
        const result = await this.pbService.getCollection('flatComments').getFullList(200, {
            filter: "flat = '" + flatId + "'",
            expand: 'user',
            sort: '+created'
        })
        return ( await result ).map(comment => mapToFlatComment(comment));
    }

    async getFlatWithComments(id: string): Promise<Flat> {
        const flat = await this.getFlatById(id);
        const comments = await this.getFlatCommentsById(id);

        // Subscribe to updates
        this.subscribeToFlatComments(id);

        ( await flat ).comments = ( await comments );
        return flat;
    }

    async addFlatComment(flatComment: FlatComment): Promise<FlatComment> {
        console.log('Trying add flat comment', flatComment);

        const data = {
            "flat": flatComment.flat.id!,
            "user": flatComment.user.id!,
            "content": flatComment.content
        }
        console.log("ADD FLAT COMMENT, ", data)
        return await this.pbService.getCollection('flatComments').create(data);
    }

    async subscribeToFlatComments(flatId: string) {
        const collection = this.pbService.getCollection('flatComments');
        collection.subscribe("*", (data: RecordSubscription<FlatComment>) => {
            console.log("Got comment " + data.action + " in flat " + data.record.flat + ": " + data.record.content)
            if (data.action == "create" && data.record.flat.toString() == flatId) {
                let user;
                this.store.select(FlatSelectors.flat).pipe(take(1)).subscribe((flat) => {
                    data.record.user = flat!.interestedUsers!.find(e => e.id == ( data.record.user as unknown as string ))!;
                    this.store.dispatch(updateFlatComments({ comment: data.record }));
                })
            }
        })
        console.log('Subscribed to flatComments for ' + flatId + ' flatId', collection);
    }

    async getFlats(): Promise<Flat[]> {
        console.log('Trying to get flats');
        const res = this.pbService.getCollection('flats').getFullList(200, {
            expand: "owner,interestedUsers,readyToLiveUsers"
        });
        return ( await res ).map(flat => mapToFlat(flat))
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
        if (filter.interestedMin) filterStr = addAnd(filterStr, "created < \"" + filter.createdMin + "\"");
        if (filter.readyToLiveMin) filterStr = addAnd(filterStr, "created < \"" + filter.createdMin + "\"");
        // Remained filters are quite hard implement on server so do in front-end.
        console.log('Looking for flats with filterString=' + filterStr, filter);
        const result = await this.pbService.getCollection('flats').getList(
            page,
            this.PER_PAGE,
            {
                filter: filterStr,
                sort: '-cost',
                expand: "owner,interestedUsers,readyToLiveUsers"
            }
        )

        return ( await result ).items.map(res => mapToFlat(res)).filter(flat => {
            if (filter.interestedMin && ( flat.interestedUsers === undefined || flat.interestedUsers!.length < filter.interestedMin )) {
                return false;
            }
            if (filter.interestedMax && ( flat.interestedUsers && flat.interestedUsers!.length > filter.interestedMax )) {
                return false;
            }
            if (filter.readyToLiveMin && ( flat.readyToLiveUsers === undefined || flat.readyToLiveUsers!.length < filter.readyToLiveMin )) {
                return false;
            }
            if (filter.readyToLiveMax && ( flat.readyToLiveUsers && flat.readyToLiveUsers!.length > filter.readyToLiveMax )) {
                return false;
            }
            return true;
        });
    }
}