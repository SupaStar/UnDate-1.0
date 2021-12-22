import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApisExternasService {
  private urlCP = environment.url + 'cp/';
  constructor(private http: HttpClient) {}
  buscarPorCp(cp: string) {
    return this.http.get<any>(this.urlCP + cp);
  }
}
