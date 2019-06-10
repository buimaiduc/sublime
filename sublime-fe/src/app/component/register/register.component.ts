import {Component, Input, OnInit} from '@angular/core';
import {AccountService} from '../../service/account.service';
import * as $ from 'jquery';
import {Router} from '@angular/router';
import {Helper} from '../../util/helper';
import * as _ from 'lodash';
import {Party} from '../../model/party';
import {PartyService} from '../../service/party.service';
import {Account} from '../../model/account';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    @Input() account: Account;
    accountConfirmPassword: string;
    contentResult: string;
    agreePolicy: boolean;
    submitted: boolean;

    parties: Array<Party> = [];
    errorMessage: string;
    partyId: string;

    constructor(private accountService: AccountService,
                private partyService: PartyService,
                private router: Router,
                private helper: Helper) {
    }

    ngOnInit() {
        this.account = new Account();
        this.account.party_id = '1';

        this.parties = [
            {'id': '1', 'name': 'US MSO'},
            {'id': '2', 'name': 'UK MSO'}];
    }

    submit(): void {
        this.errorMessage = '';
        if (!_.eq(this.account.password, this.accountConfirmPassword)) {
            this.errorMessage = this.helper.getError('validation.password.notMatch', null);
            return;
        }

        this.submitted = true;
        if (this.accountService.isValidAccount(this.account) && this.agreePolicy) {
            this.accountService.generateAccount(this.account)
                .subscribe(
                    res => {
                        this.contentResult = res;
                        this.router.navigate(['']);
                    },
                    error => {
                        this.errorMessage = error.error.message;
                    });
        }
    }

    updateAccountType($event: MouseEvent, accountType: string) {
        $('.account-type-container label').removeClass('active');
        $($event.currentTarget).next().addClass('active');
    }

    acceptPolicy() {
        this.agreePolicy = !this.agreePolicy;
    }

    getPartyValue(id: string) {
        this.partyId = id;
        this.account.party_id = id;
    }
}
