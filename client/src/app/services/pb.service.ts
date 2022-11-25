import PocketBase from 'pocketbase';
import { Injectable } from "@angular/core";

const connectionUrl = 'http://172.16.101.228:3000';

export const STATIC_PATH = "http://127.0.0.1:3000/api/files/"

@Injectable({ providedIn: "root" })
export class PocketBaseService {

    private pb = new PocketBase(connectionUrl);

    constructor() {

    }

    get PocketBaseInstance(): PocketBase {
        return this.pb;
    }

    async Logout() {
        console.log('Logging out');
        await this.pb.authStore.clear()
    }
}
