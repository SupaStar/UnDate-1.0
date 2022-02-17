/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  public idEditarDireccion = null;
  public idPackFavorite = null;
  private login = environment.url + 'login';
  private registro = environment.url + 'register';
  private actualizar = environment.url + 'actualizar_usuario';
  private urlCP = environment.url + 'cp/';
  private urlAgregarDireccion = environment.url + 'usuario/direccion';
  private urlEditarDireccion = environment.url + 'usuario/editar_direccion';
  private urlRequestResetPassword = environment.url + 'request_reset_password';
  private urlValidatecode = environment.url + 'validateCode/';
  private urlNewPassword = environment.url + 'reset_password';
  private urlAddFavorite = environment.url + 'usuario/favorito';
  private urlFavoritos = environment.url + 'usuario/favoritos';
  private urlCambiarPassPerfil =
    environment.url + 'usuario/cambiar_pass_perfil';
  private urlCotizar = environment.url + 'usuario/cotizar';
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
    return this.http.post<any>(
      this.urlAgregarDireccion,
      direccion,
      httpOptions
    );
  }
  editarDireccion(direccion: any) {
    const httpOptions = this.refrecarToken();
    return this.http.post<any>(this.urlEditarDireccion, direccion, httpOptions);
  }
  refrecarToken() {
    const jwt = localStorage.getItem('_t_s');
    const headersO = new HttpHeaders().set('Authorization', 'Bearer ' + jwt);
    const httpOptions = {
      headers: headersO,
    };
    return httpOptions;
  }
  requestResetPassword(usuario: any) {
    return this.http.post<any>(this.urlRequestResetPassword, usuario);
  }
  validateCode(code: any) {
    return this.http.get<any>(this.urlValidatecode + code);
  }
  newPassword(user: any) {
    return this.http.post<any>(this.urlNewPassword, user);
  }
  favorite(id: any) {
    const httpOptions = this.refrecarToken();
    return this.http.post<any>(
      this.urlAddFavorite,
      { paquete_id: id },
      httpOptions
    );
  }
  favoritos() {
    const httpOptions = this.refrecarToken();
    return this.http.get<any>(this.urlFavoritos, httpOptions);
  }
  cambiarPassPerfil(pass: any) {
    const httpOptions = this.refrecarToken();
    return this.http.post<any>(this.urlCambiarPassPerfil, pass, httpOptions);
  }
  cotizar(carrito: any, idDireccion: any, fechaDeseada: any) {
    const body = {
      paquetes: carrito,
      direccion: idDireccion,
      fechaD: fechaDeseada,
    };
    const httpOptions = this.refrecarToken();
    return this.http.post<any>(this.urlCotizar, body, httpOptions);
  }
}
