import {NgModule} from '@angular/core';
import {ApiClient} from './api-client';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {NoopInterceptor} from './noop.interceptor';
import {ApiClientResponseInterceptor} from './api-client-response.interceptor';
import {ApiClientRequestInterceptor} from './api-client-request.interceptor';

export const HTTP_INTERCEPTOR_PROVIDERS = [
  {provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: ApiClientResponseInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: ApiClientRequestInterceptor, multi: true},
];

@NgModule({
  providers: [
    ApiClient,
    HTTP_INTERCEPTOR_PROVIDERS
  ]
})
export class HttpInterceptorModule {

}
