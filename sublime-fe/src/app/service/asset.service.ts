import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {ApiClient} from '../component/http-interceptor/api-client';
import {Observable} from 'rxjs';
import {CacheService} from './cache.service';
import {Router} from '@angular/router';
import {Asset} from '../model/asset';

const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class AssetService {

    private currencies: string[] = ['GBP', 'USD', 'EUR', 'CHF', 'JPY', 'CNY'];

    constructor(private apiClient: ApiClient,
                private cacheService: CacheService,
                private router: Router) {
    }

    getAssets(): Observable<any> {
        return this.apiClient.get('/assets', 'json', 0);
    }

    issueAsset(request: any): any {
        return this.apiClient.post('/assets', request, HTTP_OPTIONS);
    }

    convertAsset(input: any): Asset {
        const asset = new Asset();
        if (input != null) {
            asset.id = input.id;
            asset.hex = input.hex;
            asset.amount = input.amount ? input.amount : 0;
        }

        return asset;
    }

    convertToAssets(res: any): Array<Asset> {
        const assets = new Array<Asset>();

        for (let i = res.length; i--;) {
            assets[i] = this.convertAsset(res[i]);
        }

        return assets;
    }
}
