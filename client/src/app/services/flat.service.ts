import { Injectable } from '@angular/core';
import { User } from 'src/app/dto/user.dto';
import { Flat } from 'src/app/dto/flat.dto';
import { PocketBaseService, STATIC_PATH } from './pb.service';
import { FlatComment } from '../dto/flatComment.dto';
import { expandAvatar } from './user.service';
import { Store } from '@ngrx/store';
import { updateFlatComments } from '../store/actions/flat.actions';
import { RecordSubscription } from 'pocketbase';
import * as FlatSelectors from '../store/selectors/flat.selectors';
import { take } from 'rxjs/operators';
import { FlatPb } from '../models/flat.model.pb';

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

function mapToFlat(flat: any): Flat {
    console.log('MAPPING TO FLAT', flat);

    const result = {
        ...flat,
        owner: expandAvatar(flat.expand?.owner!),
        interestedUsers: flat.expand?.interestedUsers?.map((user: User) => expandAvatar(user)),
        readyToLiveUsers: flat.expand?.readyToLiveUsers?.map((user: User) => expandAvatar(user)),
        downloadedPhotos: 'photo' in flat ? flat.photo.map((photo: string) => toFilePath(flat.id, photo)) : ''
    };
    delete result.expand;
    delete result.photo;

    console.log('MAPPED TO FLAT', result);
    return result;
}

function mapToFlatComment(comment: any): FlatComment {
    const result = {
        ...comment,
        user: expandAvatar(comment.expand!.user!)
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

            return mapToFlat(flat);
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
        });

        return mapToFlat(res);
    }

    async getFlatCommentsById(flatId: string): Promise<FlatComment[]> {
        console.log('Trying to get comments for flat by id:', flatId);
        const result = await this.pbService.getCollection('flatComments').getFullList(200, {
            filter: "flat = '" + flatId + "'",
            expand: 'user',
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

        const data = {
            flat: flatId,
            user: flatComment.user.id!,
            content: flatComment.content
        };
        console.log('ADD FLAT COMMENT, ', data);
        const newFlatComment = await this.pbService.getCollection('flatComments').create(data);

        const flat = await flatCollection.getOne(flatId);

        const flatComments = (flat as any).comments as string[];

        const newFlatState = {
            ...flat,
            comments: [...flatComments, newFlatComment.id]
        };

        console.log('Trying to update flat state. new state: ', newFlatState);

        await flatCollection.update(newFlatState.id, newFlatState);

        console.log('Flat comment successfully added.');
        return flatComment;
    }

    async getCommentWithSenderAvatar(comment: FlatComment) {
        const senderId = (comment.user) as unknown as string;

        const sender = await this.pbService.getCollection('users').getOne(senderId) as User;

        const expandedAvatar = expandAvatar(sender);

        const data: FlatComment = {
            ...comment,
            user: expandedAvatar
        };

        return data;
    }

    async subscribeToFlatComments(flatId: string) {
        const flatsCollection = this.pbService.getCollection('flats');

        flatsCollection.subscribe(flatId, async (data: RecordSubscription<Flat>) => {
            const flatRecord = data.record;
            console.log('New flat state ', flatRecord);
            if (data.action === 'update') {
                const flatComments = flatRecord.comments as unknown as string[];

                const lastcommentId = flatComments.pop();

                const newComment = await this.pbService.getCollection('flatComments').getOne(lastcommentId!) as FlatComment;

                console.log('New flat comment: ', newComment);

                const fullNewComment = await this.getCommentWithSenderAvatar(newComment);

                this.store.select(FlatSelectors.flat).pipe(take(1)).subscribe((flat) => {
                    this.store.dispatch(updateFlatComments({ comment: fullNewComment }));
                });
            }
        });
        console.log('Subscribed to flatComments for ' + flatId + ' flatId', flatsCollection);
    }

    async getFlats(): Promise<Flat[]> {
        console.log('Trying to get flats');
        const res = this.pbService.getCollection('flats').getFullList(200, {
            expand: 'owner,interestedUsers,readyToLiveUsers'
        });
        return (await res).map(flat => mapToFlat(flat));
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
        const result = await this.pbService.getCollection('flats').getList(
            page,
            this.PER_PAGE,
            {
                filter: filterStr,
                sort: '-cost',
                expand: 'owner,interestedUsers,readyToLiveUsers'
            }
        );

        return (await result).items.map(res => mapToFlat(res)).filter(flat => {
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
