import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

const TTL = 60 * 10;
const CACHE_KEY = '_data_cached_API_';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  constructor(private storage: Storage) {}
  async initStorage() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
  }
  cacheRequest(url, data): Promise<any> {
    const validUntil = new Date().getTime() + TTL * 1000;
    url = `${CACHE_KEY}${url}`;
    return this.storage.set(url, { validUntil, data });
  }
  async getCachedRequest(url): Promise<any> {
    const currentTime = new Date().getTime();
    url = `${CACHE_KEY}${url}`;
    const storedValue = await this.storage.get(url);
    if (!storedValue) {
      return null;
    } else if (storedValue.validUntil < currentTime) {
      await this.storage.remove(url);
      return null;
    } else {
      return storedValue.data;
    }
  }

  async clearCachedData() {
    const keys = await this.storage.keys();
    keys.map(async (key) => {
      if (key.startsWith(CACHE_KEY)) {
        await this.storage.remove(key);
      }
    });
  }

  // Example to remove one cached URL
  async invalidateCacheEntry(url) {
    url = `${CACHE_KEY}${url}`;
    await this.storage.remove(url);
  }
}
