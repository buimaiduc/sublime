import {Component, Input, OnInit} from '@angular/core';
import {Account} from '../../model/account';
import {AccountService} from '../../service/account.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
    @Input() account: Account;
    contentResult$: Observable<string>;
    contentResult: string;

    constructor(private accountService: AccountService) {
    }

    ngOnInit() {
        this.account = new Account();
    }

    submit(): void {
        if (this.accountService.isValidAccount(this.account)) {
            this.accountService.generateAccount(this.account)
                .subscribe(
                    res => {
                        this.contentResult = res;
                    },
                    error => {
                        this.contentResult = error;
                    },
                    () => {
                    });
        }
    }
}
