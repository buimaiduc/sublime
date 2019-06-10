import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AccountService} from '../../service/account.service';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from "rxjs/operators";

@Injectable()
export class ApiClientResponseInterceptor implements HttpInterceptor {

    constructor(private accountService: AccountService,
                private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(map(
                (event: HttpEvent<any>) => {
                    // TODO: need to login again?
                    if (event instanceof HttpResponse && event.status === 401) {
                        this.accountService.logout();
                        this.router.navigate(['']);
                    }

                    return event;
                }, error => {
                    console.log(error);
                }),
                catchError((error: any) => {
                    if (error.status === 401) {
                        this.accountService.logout();
                        this.router.navigate(['']);
                    }
                    return throwError(error);
                })
            );
    }
}
