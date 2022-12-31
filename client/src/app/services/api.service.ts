import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SERVER_URL } from '../symbols/serverUrl.token';

@Injectable()
export class ApiService {
    constructor(
        private readonly http: HttpClient,
        @Inject(SERVER_URL) serverUrl: string
    ) {
    }

    get(url: string, options: any) {
        return this.http.get(SERVER_URL + url, options);
    }
}
