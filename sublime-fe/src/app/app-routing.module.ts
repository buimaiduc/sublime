import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './component/register/register.component';
import {AccountApiKeyComponent} from './component/account-api-key/account-api-key.component';
import {SigninComponent} from './component/signin/signin.component';
import {AuthGuard} from './service/auth-guard.service';
import {AccountBasicInfoComponent} from './component/account-basic-info/account-basic-info.component';

const MAIN_ROUTES: Routes = [
    {path: '', component: SigninComponent, canActivate: [AuthGuard]},
    {path: 'sign-up', component: RegisterComponent, canActivate: [AuthGuard]},
    {path: 'basic-info', component: AccountBasicInfoComponent, canActivate: [AuthGuard]},
    {path: 'transactions', component: AccountApiKeyComponent, canActivate: [AuthGuard]},
    {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forRoot(MAIN_ROUTES, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
