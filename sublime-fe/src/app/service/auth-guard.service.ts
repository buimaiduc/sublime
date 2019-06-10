import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AccountService} from './account.service';
import * as _ from 'lodash';

const SIGN_IN_PATHS = [
    '/',
    '/sign-in',
    '/sign-up',
];

const RESET_PATH = '/reset-password';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private accountService: AccountService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (!this.accountService.isAccountActivated()) {
            if (this.isMatchedUrl(state.url)) {
                return true;
            }

            this.router.navigate(['']);
            return false;
        }

        if (this.isMatchedUrl(state.url)) {
            this.router.navigate(['/transactions']);
            return false;
        }

        return true;
    }

    private isMatchedUrl(url: string): boolean {
        return _.includes(SIGN_IN_PATHS, url) || url.match(RESET_PATH) != null;
    }
}
