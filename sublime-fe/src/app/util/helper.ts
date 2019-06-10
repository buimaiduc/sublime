import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Error} from '../model/error';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class Helper {
    private lang: string;

    constructor(private translateService: TranslateService) {

    }

    translate(key: string) {
        let lang = this.translateService && this.translateService.getDefaultLang() || '';
        return this.translateService.instant(key);
    }

    getError(error: any, optionalError: any): any {
        if (error && _.includes(error, 'validation.')) {
            return new Error('ERR', this.translate(error));
        }

        if (error) {
            if (_.includes(error.errorCode, 'validation.')) {
                return new Error(error.exceptionId, this.translate(error.errorCode));
            }

            return new Error(error.exceptionId, this.translate('validation.' + error.errorCode));
        }

        return optionalError;
    }

    showHideLoader(isShow?: any) {
        let $blockUI = $('#loading-ui');

        if (isShow) {
            $blockUI.css('display', 'block');
        } else {
            $blockUI.css('display', 'none');
        }
    }
}
