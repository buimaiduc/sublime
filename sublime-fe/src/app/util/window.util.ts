import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class WindowUtil {

    static putValue(key: string, value: string): void {
        window[key] = value;
    }

    static getValue(key: string): string {
        return window[key];
    }

    static resetValue(key: string): void {
        window[key] = null;
    }
}