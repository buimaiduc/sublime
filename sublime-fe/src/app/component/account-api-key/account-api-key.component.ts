import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AccountService} from '../../service/account.service';
import * as $ from 'jquery';
import {CURRENCIES} from '../../constant/constant';
import {TransferService} from '../../service/transfer.service';
import {Helper} from '../../util/helper';
import {AssetService} from '../../service/asset.service';

@Component({
    selector: 'app-account-api-key',
    templateUrl: './account-api-key.component.html',
    styleUrls: ['./account-api-key.component.css']
})
export class AccountApiKeyComponent implements OnInit {

    errorMessage: string;

    @ViewChild('openCreatedApiKeyBtn') openCreatedApiKeyBtn: ElementRef;

    desc: string;
    ipWhitelist: string;
    currencies: any = CURRENCIES;
    transactions: any = [];
    address: string;
    amount: number;
    assets = new Map<string, string>();

    constructor(private accountService: AccountService,
                private transferService: TransferService,
                private assetService: AssetService,
                private helper: Helper) {
    }

    ngOnInit() {
        this.errorMessage = '';
        const sessionId = this.accountService.getSessionId();

        this.assetService.getAssets().subscribe(res => {

            for (let i = res['assets'].length; i--;) {
                const asset = this.assetService.convertAsset(res['assets'][i]);
                this.assets.set(asset.hex, asset.id);
            }
        }, error => {
            this.errorMessage = this.helper.getError(error.error, error);
        });
        this.retrieveTransactions();
    }

    logout() {
        this.accountService.logout();
    }

    private transferTransaction() {
        if (this.address && this.amount) {
            $('.null-error, .request-error').hide();

            $('#loading-ui').show();
            this.transferService.createTransfer({
                'session_id': this.accountService.getSessionId(),
                'asset_amount': this.amount,
                'email': this.address
            }).subscribe(res => {
                // get the balance again
                this.retrieveTransactions(true);
            }, error => {
                this.errorMessage = error.error.message;
                $('.null-error').show();
                $('#loading-ui').hide();
            });
        } else {
            this.errorMessage = 'The Email and Amount are required.';
            $('.null-error').show();
        }
    }

    private retrieveTransactions(hideBlockUi?: boolean) {


        this.transferService.getTransfers().subscribe(res => {
            hideBlockUi && $('#loading-ui').hide();
            this.transactions = this.transferService.convertToTransfers(res['transactions'], this.assets);
        }, error => {
            hideBlockUi && $('#loading-ui').hide();
            this.errorMessage = this.helper.getError(error.error, error);
        });
    }
}
