import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import * as _ from 'lodash';
import {Helper} from "../../util/helper";

export const HTTP_VERBS = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    DELETE: "DELETE"
};

@Injectable({
    providedIn: 'root'
})
export class ApiClient {
    constructor(private httpClient: HttpClient,
                private helper: Helper) {
    }

    public get<T>(url: string, responseType: string = 'json', retry: number = 0): Observable<T> {
        return this.send(HTTP_VERBS.GET, url, null, {});
    }

    public post(url: string, request: any, options: { headers: HttpHeaders }): Observable<any> {
        return this.send(HTTP_VERBS.POST, url, request, options);
    }

    public delete(url: string, options: { headers: HttpHeaders }): Observable<any> {
        return this.send(HTTP_VERBS.DELETE, url, null, options);
    }

    public put<T>(url: string, request: T, options: { headers: HttpHeaders }) {
        return this.send(HTTP_VERBS.PUT, url, request, options);
    }

    private send(method: string, url: string, request: any, options: any): Observable<any> {
        // this.helper.showHideLoader(true);

        return this.httpClient[_.lowerCase(method)](
            url,
            (method == HTTP_VERBS.POST) || (method == HTTP_VERBS.PUT) ? request : options,
            (method == HTTP_VERBS.POST) || (method == HTTP_VERBS.PUT) ? request : null
        ).pipe(
            map(res => {
                // this.helper.showHideLoader(false);
                return res
            }),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage: string;
        errorMessage = '';

        // this.helper.showHideLoader(false);
        if (error.error && error.error.message) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `Error: ${error.error.message}`;
            console.error();
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong
            errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
            console.error(errorMessage);
        }

        // return an observable with a user-facing error message
        return throwError(error);
    }
}
