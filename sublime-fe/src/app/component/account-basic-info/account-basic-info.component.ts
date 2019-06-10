import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../service/account.service';
import {Account} from '../../model/account';
import {AccountProfile} from '../../model/account-profile';
import {TranslateService} from '@ngx-translate/core';
import {CacheService} from '../../service/cache.service';
import {Helper} from '../../util/helper';
import {AssetService} from '../../service/asset.service';
import {CURRENCIES} from "../../constant/constant";

@Component({
    selector: 'app-account-basic-info',
    templateUrl: './account-basic-info.component.html',
    styleUrls: ['./account-basic-info.component.css']
})
export class AccountBasicInfoComponent implements OnInit {
    account: Account;
    errorMessage: string;
    currencies: any = CURRENCIES;
    currencySelected: string = '';
    assets: any = [];

    constructor(private accountService: AccountService,
                private translateService: TranslateService,
                private cacheService: CacheService,
                private assetService: AssetService,
                private helper: Helper) {
    }

    logout() {
        this.accountService.logout();
    }

    ngOnInit() {
        this.account = new Account();

        this.retrieveAssets();

        return this.accountService.getAccount()
            .subscribe(
                res => {
                    let accountProfile = new AccountProfile();
                    accountProfile = res;
                    // parse the date with format
                    this.account = this.accountService.convertAccountProfileToAccount(accountProfile);
                },
                error => {
                    this.errorMessage = error.error.message;
                }
            );
    }

    generateAsset() {
        if (this.currencySelected) {
            $("#loading-ui").show();
            this.assetService.issueAsset({
                'asset_label': this.currencySelected,
                'session_id': this.accountService.getSessionId()
            }).subscribe(res => {
                // get the balance again
                this.retrieveAssets(true);
            }, error => {
                $("#loading-ui").hide();
                this.errorMessage = this.helper.getError(error.error, error);
            });
        }
    }

    removeAsset(index) {
        this.assets.splice(index, 1);
    }

    private retrieveAssets(hideBlockUi?: boolean) {
        this.assetService.getAssets().subscribe(res => {
            hideBlockUi && $("#loading-ui").hide();
            this.assets = this.assetService.convertToAssets(res['assets']);
        }, error => {
            hideBlockUi && $("#loading-ui").hide();
            this.errorMessage = this.helper.getError(error.error, error);
        });
    }
}
