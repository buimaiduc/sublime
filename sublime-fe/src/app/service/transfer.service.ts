import {Injectable} from '@angular/core';
import {ApiClient} from '../component/http-interceptor/api-client';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Transfer} from '../model/transfer';
import {AssetService} from './asset.service';
import {HttpHeaders} from '@angular/common/http';

const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class TransferService {

    constructor(private apiClient: ApiClient,
                private assetService: AssetService,
                private router: Router) {
    }

    getTransfers(): Observable<any> {
        return this.apiClient.get('/transfers', 'json', 0);
    }

    createTransfer(request: any): Observable<any> {
        return this.apiClient.post('/transfers', request, HTTP_OPTIONS);
    }

    getTransferById(accountSRN: string, transferId: string, limit: number): Observable<any> {
        return this.apiClient.get('/transfers/' + accountSRN + '?search=' + transferId + '&limit=' + limit);
    }

    convertToTransfer(input: any): Transfer {
        const transfer = new Transfer();
        if (input != null) {
            transfer.txid = input.txid;
            transfer.address = input.address;
            transfer.category = input.category;
            transfer.asset = input.asset;
            transfer.amount = input.amount;
            transfer.time = input.time;
        }

        return transfer;
    }

    convertToTransfers(res: any, assets: Map<string, string>): Array<Transfer> {
        const transfers = new Array<Transfer>();

        for (let i = res.length; i--;) {
            transfers[i] = this.convertToTransfer(res[i]);
            transfers[i]['asset'] = assets.get(transfers[i]['asset']);
        }

        return transfers;
    }
}
