import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  private login = environment.url + 'login';
  private registro = environment.url + 'register';
  private actualizar = environment.url + 'actualizar_usuario';
  private urlCP = environment.url + 'cp/';
  private urlAgregarDireccion = environment.url + 'usuario/direccion';
  constructor(private http: HttpClient) {}
  iniciarSesion(usuario: any) {
    return this.http.post<any>(this.login, usuario);
  }
  registrarUsuario(usuario: any) {
    return this.http.post<any>(this.registro, usuario);
  }
  actualizarUsuario(usuario: any) {
    const httpOptions = this.refrecarToken();
    return this.http.post<any>(this.actualizar, usuario, httpOptions);
  }
  buscarPorCp(cp: string) {
    const httpOptions = this.refrecarToken();
    return this.http.get<any>(this.urlCP + cp, httpOptions);
  }
  agregarDireccion(direccion: any) {
    const httpOptions = this.refrecarToken();
    return this.http.post<any>(this.urlAgregarDireccion, direccion, httpOptions);
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
