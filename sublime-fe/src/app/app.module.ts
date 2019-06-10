import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AccountComponent} from './component/account/account.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpInterceptorModule} from './component/http-interceptor/http-interceptor.module';
import {RegisterComponent} from './component/register/register.component';
import {AccountApiKeyComponent} from './component/account-api-key/account-api-key.component';
import {AccountBasicInfoComponent} from './component/account-basic-info/account-basic-info.component';
import {SigninComponent} from './component/signin/signin.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        AccountComponent,
        RegisterComponent,
        AccountApiKeyComponent,
        AccountBasicInfoComponent,
        SigninComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        HttpInterceptorModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NgbModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
