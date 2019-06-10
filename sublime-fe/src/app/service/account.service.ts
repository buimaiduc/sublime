import {Injectable} from '@angular/core';
import {Account} from '../model/account';
import {HttpHeaders} from '@angular/common/http';
import {ApiClient} from '../component/http-interceptor/api-client';
import {Observable} from 'rxjs';
import {CacheService} from './cache.service';
import {Router} from '@angular/router';
import {AccountProfile} from '../model/account-profile';

const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

const DELIMITER = ';';
const ACCOUNT_TOKEN_KEY = 'accountToken';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    constructor(private apiClient: ApiClient,
                private cacheService: CacheService,
                private router: Router) {
    }

    isValidAccount(account: Account): boolean {
        if (account.email && account.password) {
            return true;
        }

        return false;
    }

    getAccount(): Observable<any> {
        return this.apiClient.get('/account', 'json', 0);
    }

    generateAccount(account: Account): Observable<string> {
        return this.apiClient.post('/accounts', account, HTTP_OPTIONS);
    }

    login(email: string, password: string): Observable<string> {
        return this.apiClient.post('/account', {email: email, password: password}, HTTP_OPTIONS);
    }

    logout(): void {
        this.cacheService.delete(ACCOUNT_TOKEN_KEY);
        this.router.navigate(['/sign-in']);
    }

    storeAccountLocalStorage(accountToken: any): void {
        this.cacheService.putItem('accountToken', accountToken);
    }

    isAccountActivated(): boolean {
        return this.cacheService.getItem(ACCOUNT_TOKEN_KEY) != null;
    }

    getSessionId(): string {
        const token = this.cacheService.getItem(ACCOUNT_TOKEN_KEY);
        if (token) {
            return token.session_id;
        }

        return null;
    }

    convertAccountProfileToAccount(accountProfile: AccountProfile): Account {
        const account = new Account();
        if (accountProfile != null) {
            account.id = accountProfile.id;
            account.email = accountProfile.email;
            account.password = accountProfile.password;
            account.session_id = accountProfile.session_id;
            account.party_id = accountProfile.party_id;
            account.partyName = accountProfile.party_id === '1' ? 'US MSO' : 'UK MSO';
            account.currency = accountProfile.currency;
        }

        return account;
    }
}
