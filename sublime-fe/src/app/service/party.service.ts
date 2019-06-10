import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {ApiClient} from '../component/http-interceptor/api-client';
import {Observable} from 'rxjs';
import {CacheService} from './cache.service';
import {Router} from '@angular/router';
import {Party} from '../model/party';

const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

const DELIMITER = ';';

const ACCOUNT_TOKEN_KEY = 'accountToken';
const ACCOUNT_ID_KEY = 'authenticatedAs';

@Injectable({
    providedIn: 'root'
})
export class PartyService {

    constructor(private apiClient: ApiClient,
                private cacheService: CacheService,
                private router: Router) {
    }


    getParties(): Observable<any> {
        return this.apiClient.get('/parties', 'json', 0);
    }

    convertParty(input: any): Party {
        const party = new Party();
        if (input != null) {
            party.id = input.id;
            party.name = input.name;
        }

        return party;
    }
}
