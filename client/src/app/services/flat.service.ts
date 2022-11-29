import { Injectable } from '@angular/core';
import { User } from 'src/app/dto/user.dto';
import { Flat } from 'src/app/dto/flat.dto';
import { PocketBaseService, STATIC_PATH } from './pb.service';
import { FlatComment } from '../dto/flatComment.dto';
import { expandAvatar } from './user.service';
import { Store } from '@ngrx/store';
import { updateFlatComments } from '../store/actions/flat.actions';
import { ListResult, RecordSubscription } from 'pocketbase';
import * as FlatSelectors from '../store/selectors/flat.selectors';
import { take } from 'rxjs/operators';
import { FlatPb } from '../models/flat.model.pb';
import { FlatCommentPb } from '../models/flatComment.model.pb';
import { UserPb } from '../models/user.model.pb';

export class FilterFlat {
    withPhoto?: boolean;
    name?: string; // substring
    owner?: User;
    area?: string; // substring
    costMin?: number;
    costMax?: number;
    capacityMin?: number;
    capacityMax?: number;
    description?: string; // substring
    createdMin?: Date; // like "not older 1 month"
    interestedMin?: number; // interested people min (more chance to book soon)
    interestedMax?: number; // not popular yet.
    readyToLiveMin?: number; // ready to live people min (more chance to book soon, used together with capacityMin/Max)
    readyToLiveMax?: number; // there are places at least (find for group of people)
}

function addAnd(str: string, suffix: string): string {
    if (str.length > 0) {
        return str + ' && ' + suffix;
    }
    return suffix;
}

function toFilePath(id: string, fileName: string) {
    return STATIC_PATH + 'flats/' + id + '/' + fileName;
}

function mapToFlat(flat: FlatPb): Flat {
    console.log('MAPPING TO FLAT', flat);

    const result: Flat = {
        ...flat,
        comments: flat.comments as unknown as FlatComment[],
        owner: expandAvatar(flat.expand?.owner!),
        interestedUsers: flat.expand?.interestedUsers?.map((user: User) => expandAvatar(user)),
        readyToLiveUsers: flat.expand?.readyToLiveUsers?.map((user: User) => expandAvatar(user)) ?? [],
        downloadedPhotos: 'photo' in flat ? flat.photo.map((photo: string) => toFilePath(flat.id!, photo)) : []
    };
    delete (result as any).expand;
    delete (result as any).photo;

    console.log('MAPPED TO FLAT', result);
    return result;
}

function mapToFlatComment(comment: any): FlatComment {
    const result = {
        ...comment,
        sender: expandAvatar(comment.expand!.sender!)
    };
    delete result.expand;
    return result;
}

@Injectable()
export class FlatService {
    readonly PER_PAGE = 20;

    constructor(private readonly pbService: PocketBaseService, private readonly store: Store) {
    }

    async createFlat(flat: Flat): Promise<Flat> {
        console.log('Trying to create flat', flat);
        return await this.pbService.getCollection('flats').create(flat);
    }

    async addUserToInterested(userId: string, flatId: string): Promise<Flat> {
        const flatCollection = this.pbService.getCollection('flats');

        const flat = await flatCollection.getOne(flatId, {
            expand: 'interestedUsers'
        }) as FlatPb;

        const interestedUsersIds = (flat?.expand!.interestedUsers?.map(user => user.id) ?? []) as string[];

        if (interestedUsersIds?.includes(userId)) {
            console.log(`THIS USER WITH ID ${userId} already interested. Skipping`);

            return flat as unknown as Flat;
        }

        const newFlatState: FlatPb = {
            ...flat,
            interestedUsers: [...interestedUsersIds, userId]
        };
        const result = await flatCollection.update(flatId, newFlatState, {
            expand: 'interestedUsers'
        }) as FlatPb;

        return mapToFlat(result);
    }

    async getFlatById(id: string): Promise<Flat> {
        console.log('Trying to get flat by id:', id);
        const res = await this.pbService.getCollection('flats').getOne(id, {
            expand: 'owner,interestedUsers,readyToLiveUsers'
        }) as FlatPb;

        return mapToFlat(res);
    }

    async getFlatCommentsById(flatId: string): Promise<FlatComment[]> {
        console.log('Trying to get comments for flat by id:', flatId);
        const result = await this.pbService.getCollection('flatComments').getFullList(200, {
            filter: "flat = '" + flatId + "'",
            expand: 'sender',
            sort: '+created'
        });
        return result.map(comment => mapToFlatComment(comment));
    }

    async getFlatWithComments(id: string): Promise<Flat> {
        const flat = await this.getFlatById(id);
        const comments = await this.getFlatCommentsById(id);

        // Subscribe to updates
        this.subscribeToFlatComments(id);

        flat.comments = comments;
        return flat;
    }

    async sendFlatComment(flatComment: FlatComment): Promise<FlatComment> {
        const flatCollection = this.pbService.getCollection('flats');

        console.log('Trying add flat comment', flatComment);
        const flatId = flatComment.flat.id!;

        const data: FlatCommentPb = {
            flat: flatId,
            sender: flatComment.sender.id!,
            content: flatComment.content
        };
        console.log('ADD FLAT COMMENT, ', data);
        const newFlatComment = await this.pbService.getCollection('flatComments').create(data) as FlatCommentPb

        const flat = await flatCollection.getOne(flatId) as FlatPb;

        const flatComments = flat.comments as string[];

        const newFlatState: FlatPb = {
            ...flat,
            comments: [...flatComments, newFlatComment.id!]
        };

        console.log('Trying to update flat state. new state: ', newFlatState);

        await flatCollection.update(newFlatState.id!, newFlatState);

        console.log('Flat comment successfully added.');
        return flatComment;
    }

    private async getCommentWithSenderAvatar(comment: FlatCommentPb): Promise<FlatComment> {

        const senderId = comment.sender

        const sender = await this.pbService.getCollection('users').getOne(senderId) as UserPb;

        const data: FlatComment = {
            ...comment as unknown as FlatComment,
            sender: expandAvatar(sender)
        };

        return data;
    }

    async subscribeToFlatComments(flatId: string) {
        const flatsCollection = this.pbService.getCollection('flats');

        flatsCollection.subscribe(flatId, async (data: RecordSubscription<FlatPb>) => {

            const updatedFlat = data.record;
            console.log('New flat state ', updatedFlat);

            if (data.action === 'update') {

                const newestCommentId = updatedFlat.comments.pop()

                if (newestCommentId) {
                    const newestComment = await this.pbService.getCollection('flatComments').getOne(newestCommentId) as FlatCommentPb;

                    console.log('NEWEST COMMENT: ', newestComment);

                    const fullNewestComment = await this.getCommentWithSenderAvatar(newestComment);

                    this.store.select(FlatSelectors.flat).pipe(take(1)).subscribe((flat) => {
                        this.store.dispatch(updateFlatComments({ comment: fullNewestComment }));
                    });
                }
            }
        });
        console.log('Subscribed to flatComments for ' + flatId + ' flatId', flatsCollection);
    }

    async getFlats(): Promise<Flat[]> {
        console.log('Trying to get flats');

        const flats = await this.pbService.getCollection('flats').getFullList(200, {
            expand: 'owner,interestedUsers,readyToLiveUsers'
        }) as FlatPb[]

        console.log('GOT FLATS FROM PB', flats)

        return flats.map(flat => mapToFlat(flat));
    }

    async searchFlat(page: number, filter: FilterFlat) {
        let filterStr: string = '';
        if (filter.withPhoto) filterStr = addAnd(filterStr, 'photo > 1');
        if (filter.owner) filterStr = addAnd(filterStr, 'owner ~ "' + filter.owner.id + '"');
        if (filter.area) filterStr = addAnd(filterStr, 'area ~ "' + filter.area + '"');
        if (filter.costMin) filterStr = addAnd(filterStr, 'cost >= ' + filter.costMin);
        if (filter.costMax) filterStr = addAnd(filterStr, 'cost <= ' + filter.costMax);
        if (filter.capacityMin) filterStr = addAnd(filterStr, 'capacity >= ' + filter.capacityMin);
        if (filter.capacityMax) filterStr = addAnd(filterStr, 'capacity <= ' + filter.capacityMax);
        if (filter.description) filterStr = addAnd(filterStr, 'description ~ "' + filter.description + '"');
        if (filter.createdMin) filterStr = addAnd(filterStr, 'created < "' + filter.createdMin + '"');
        if (filter.interestedMin) filterStr = addAnd(filterStr, 'created < "' + filter.createdMin + '"');
        if (filter.readyToLiveMin) filterStr = addAnd(filterStr, 'created < "' + filter.createdMin + '"');
        // Remained filters are quite hard implement on server so do in front-end.
        console.log('Looking for flats with filterString=' + filterStr, filter);
        const foundFlats = await this.pbService.getCollection('flats').getList(
            page,
            this.PER_PAGE,
            {
                filter: filterStr,
                sort: '-cost',
                expand: 'owner,interestedUsers,readyToLiveUsers'
            }
        ) as ListResult<FlatPb>

        return foundFlats.items.map(res => mapToFlat(res)).filter(flat => {
            if (filter.interestedMin && (flat.interestedUsers === undefined || flat.interestedUsers!.length < filter.interestedMin)) {
                return false;
            }
            if (filter.interestedMax && (flat.interestedUsers && flat.interestedUsers!.length > filter.interestedMax)) {
                return false;
            }
            if (filter.readyToLiveMin && (flat.readyToLiveUsers === undefined || flat.readyToLiveUsers!.length < filter.readyToLiveMin)) {
                return false;
            }
            if (filter.readyToLiveMax && (flat.readyToLiveUsers && flat.readyToLiveUsers!.length > filter.readyToLiveMax)) {
                return false;
            }
            return true;
        });
    }
}
