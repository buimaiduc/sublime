import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  put(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  putItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }

  get(key: string): string {
    return localStorage.getItem(key);
  }

  getItem(key: string): any {
    return JSON.parse(this.get(key));
  }
}
