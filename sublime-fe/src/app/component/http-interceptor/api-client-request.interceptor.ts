import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {getApiUrl} from '../../constant/http-client.config';
import {AccountService} from '../../service/account.service';

function toUrl(url: string): string {
  if (url && url.charAt(0) === '/') {
    return getApiUrl() + url;
  }

  return getApiUrl() + '/' + url;
}

@Injectable()
export class ApiClientRequestInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only intercept for API requests
    if (req.url && req.url.charAt(0) != '.') {

      req = req.clone({
        url: toUrl(req.url)
      });

      if (!req.headers.has('Content-Type')) {
        req = req.clone({headers: req.headers.set('Content-Type', 'application/json')});
      }

      if (!req.params.has('session_id') && this.accountService.getSessionId() != null) {
        req = req.clone({params: req.params.set('session_id', this.accountService.getSessionId())});
      }
    }

    return next.handle(req);
  }
}
