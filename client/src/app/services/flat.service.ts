import { Injectable } from "@angular/core";
import { User } from "src/app/dto/user.dto";
import { Flat } from "src/app/dto/flat.dto";
import { pbService } from "./pb.service";

export class FilterFlat {

}

@Injectable()
export class FlatService {
    readonly PER_PAGE = 20;

    constructor() {
    }

    async createFlat(flat: Flat): Promise<Flat> {
        console.log('Trying to create flat', flat);
        return await pbService.PocketBaseInstance.collection('flats').create(flat);
    }

    async updateFlat(flat: Flat): Promise<Flat> {
        console.log('Trying to update flat', flat);
        return await pbService.PocketBaseInstance.collection('flats').update(flat);
    }

    async getFlatById(id: string): Promise<Flat> {
        console.log('Trying to get flat by id:', id);
        return await pbService.PocketBaseInstance.collection('flats').getOne(id);
    }

    async getFlats(): Promise<Flat[]> {
        console.log('Trying to get flast');
        return await pbService.PocketBaseInstance.collection('flats').getFullList(200);
    }

    async searchFlat(page: number, filter: FilterFlat) { // TODO
        return await pbService.PocketBaseInstance.collection('flats').getList(
            page,
            this.PER_PAGE,
            {
                "filter": filter,
                "sort": '-cost'
            }
        )
    }
}
