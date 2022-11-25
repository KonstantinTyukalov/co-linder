import PocketBase from 'pocketbase';

class PocketBaseService {
    constructor(private readonly pb: PocketBase) {
    }

    get PocketBaseInstance(): PocketBase {
        return pb;
    }

    async Logout() {
        console.log('Logging out');
        await pb.authStore.clear()
    }
}

const connectionUrl = 'http://172.16.101.228:3000';

const pb = new PocketBase(connectionUrl);
export const pbService = new PocketBaseService(pb)
