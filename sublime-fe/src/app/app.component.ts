import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CacheService} from './service/cache.service';
import {APIPI_LANG} from './constant/constant';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'key-generator';

    constructor(private translateService: TranslateService,
                private cacheService: CacheService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translateService.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        let lang = cacheService.get(APIPI_LANG);
        if (lang) {
            translateService.use(lang);
        } else {
            translateService.use('en');
        }
    }
}
