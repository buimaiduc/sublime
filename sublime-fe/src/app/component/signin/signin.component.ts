import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../service/account.service';
import {Router} from '@angular/router';
import {Helper} from '../../util/helper';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
    email: string;
    password: string;
    errorMessage: string;
    contentResult: string;

    constructor(private accountService: AccountService,
                private router: Router,
                private helper: Helper) {

    }

    ngOnInit() {
        if (this.accountService.isAccountActivated()) {
            this.router.navigate(['/basic-info']);
        }
    }

    login(): void {
        if (this.email && this.password) {
            this.accountService.login(this.email, this.password)
                .subscribe(
                    res => {
                        this.contentResult = res;
                        this.accountService.storeAccountLocalStorage(res);
                        this.router.navigate(['/basic-info']);
                    },
                    error => {
                        this.errorMessage = this.helper.getError(error.error, error);
                    });
        }
    }
}
