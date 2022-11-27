import PocketBase, { LocalAuthStore } from 'pocketbase';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export const STATIC_PATH = environment.serverUrl + '/api/files/';

export type CollectionNameType = CollectionName
| 'users'
| 'chats'
| 'chatMessages'
| 'flats'
| 'flatComments';

export enum CollectionName {
    USERS = 'users',
    CHATS = 'chats',
    CHATMESSAGES = 'chatMessages',
    FLATS = 'flats',
    FLAT_COMMENTS = 'flatComments',
}

@Injectable({ providedIn: 'root' })
export class PocketBaseService {
    private readonly pb: PocketBase;

    constructor() {
        const authStore = new LocalAuthStore();
        // authStore.loadFromCookie()
        console.log('AuthStore=', authStore);
        this.pb = new PocketBase(environment.serverUrl, authStore);
    }

    getCollection(collectionName: CollectionNameType) {
        return this.pb.collection(collectionName);
    }

    async Logout() {
        console.log('Logging out');
        await this.pb.authStore.clear();
    }
}
