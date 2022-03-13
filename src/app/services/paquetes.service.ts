import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { CachingService } from './caching.service';
import { from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaquetesService {
  private paquetes = environment.url + 'paquetes/paquetes';
  private paquete = environment.url + 'paquetes/paquete';
  private urlSearch = environment.url + 'paquetes/busqPaquetes/';
  private internet = true;
  constructor(
    private http: HttpClient,
    private network: Network,
    private cacheS: CachingService
  ) {
    const disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.internet = false;
    });
    const connectSubscription = this.network.onConnect().subscribe(() => {
      this.internet = true;
    });
  }
  getPaquetes(forceRefresh = false) {
    const httpOptions = this.refrecarToken();
    if (!this.internet) {
      return from(this.cacheS.getCachedRequest(this.paquetes));
    } else {
      if (forceRefresh) {
        return this.getPetitionCache(this.paquetes, httpOptions);
      } else {
        const storedValue = from(this.cacheS.getCachedRequest(this.paquetes));
        return storedValue.pipe(
          switchMap((res) => {
            if (res) {
              return of(res);
            } else {
              return this.getPetitionCache(this.paquetes, httpOptions);
            }
          })
        );
      }
    }
    return this.http.get<any>(this.paquetes, httpOptions);
  }
  getPaquete(id: number, forceRefresh = false) {
    const httpOptions = this.refrecarToken();
    const newUrl = this.paquete + '/' + id;
    if (!this.internet) {
      return from(this.cacheS.getCachedRequest(newUrl));
    }
    if (forceRefresh) {
      return this.getPetitionCache(newUrl, httpOptions);
    } else {
      const storedValue = from(this.cacheS.getCachedRequest(newUrl));
      return storedValue.pipe(
        switchMap((res) => {
          if (res) {
            return of(res);
          } else {
            return this.getPetitionCache(newUrl, httpOptions);
          }
        })
      );
    }
  }
  refrecarToken() {
    const jwt = localStorage.getItem('_t_s');
    const headersO = new HttpHeaders().set('Authorization', 'Bearer ' + jwt);
    const httpOptions = {
      headers: headersO,
    };
    return httpOptions;
  }
  buscar(termino: string) {
    const httpOptions = this.refrecarToken();
    return this.http.get<any>(this.urlSearch + termino, httpOptions);
  }
  getPetitionCache(url, httpOpts): Observable<any> {
    return this.http.get(url, httpOpts).pipe(
      tap((res) => {
        this.cacheS.cacheRequest(url, res);
      })
    );
  }
}
