import PocketBase, { LocalAuthStore } from 'pocketbase';
import { Injectable } from "@angular/core";

const connectionUrl = 'http://172.16.101.228:3000';

export const STATIC_PATH = connectionUrl + "/api/files/"

export type CollectionNameType = CollectionName
    | 'users'
    | 'chats'
    | 'chatMessages'
    | 'interests'
    | 'flats'
    | 'flatComments';

export enum CollectionName {
    USERS = 'users',
    CHATS = 'chats',
    CHATMESSAGES = 'chatMessages',
    INTERESTS = 'interests',
    FLATS = 'flats',
    FLAT_COMMENTS = 'flatComments',
}

@Injectable({ providedIn: "root" })
export class PocketBaseService {

    private pb: PocketBase;

    constructor() {
        const authStore = new LocalAuthStore()
        // authStore.loadFromCookie()
        console.log("AuthStore=", authStore)
        this.pb = new PocketBase(connectionUrl, authStore)
    }

    get PocketBaseInstance(): PocketBase {
        return this.pb;
    }

    getCollection(collectionName: CollectionNameType) {
        return this.pb.collection(collectionName)
    }

    async Logout() {
        console.log('Logging out');
        await this.pb.authStore.clear()
    }
}
