import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaquetesService {
  private paquetes = environment.url + 'paquetes/paquetes';
  private paquete = environment.url + 'paquetes/paquete';
  constructor(private http: HttpClient) {}
  getPaquetes() {
    const httpOptions = this.refrecarToken();
    return this.http.get<any>(this.paquetes, httpOptions);
  }
  getPaquete(id: number) {
    const httpOptions = this.refrecarToken();
    return this.http.get<any>(this.paquete + '/' + id, httpOptions);
  }
  refrecarToken() {
    const jwt = localStorage.getItem('_t_s');
    const headersO = new HttpHeaders().set('Authorization', 'Bearer ' + jwt);
    const httpOptions = {
      headers: headersO,
    };
    return httpOptions;
  }
}
