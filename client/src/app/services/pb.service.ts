import PocketBase, { LocalAuthStore } from 'pocketbase';
import { Injectable } from "@angular/core";

const connectionUrl = 'http://172.16.101.228:3000';

export const STATIC_PATH = connectionUrl + "/api/files/"

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

    async Logout() {
        console.log('Logging out');
        await this.pb.authStore.clear()
    }
}
