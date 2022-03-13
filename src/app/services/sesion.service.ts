/* eslint-disable @typescript-eslint/naming-convention */
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
export class SesionService {
  public idEditarDireccion = null;
  public idPackFavorite = null;
  private login = environment.url + 'login';
  private registro = environment.url + 'register';
  private registroG = environment.url + 'registerG';
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
  private urlMisCotizaciones = environment.url + 'usuario/cotizaciones';
  private urlCrearPass = environment.url + 'usuario/crearPassword';
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
  favoritos(forceRefresh = false) {
    const httpOptions = this.refrecarToken();
    if (!this.internet) {
      return from(this.cacheS.getCachedRequest(this.urlFavoritos));
    }
    if (forceRefresh) {
      return this.getPetitionCache(this.urlFavoritos, httpOptions);
    } else {
      const storedValue = from(this.cacheS.getCachedRequest(this.urlFavoritos));
      return storedValue.pipe(
        switchMap((res) => {
          if (res) {
            return of(res);
          } else {
            return this.getPetitionCache(this.urlFavoritos, httpOptions);
          }
        })
      );
    }
  }
  cambiarPassPerfil(pass: any) {
    const httpOptions = this.refrecarToken();
    return this.http.post<any>(this.urlCambiarPassPerfil, pass, httpOptions);
  }
  cotizar(carrito: any, idDireccion: any, fechaDeseada: any, personas: any) {
    const body = {
      paquetes: carrito,
      direccion: idDireccion,
      fechaD: fechaDeseada,
      nPersonas: personas,
    };
    const httpOptions = this.refrecarToken();
    return this.http.post<any>(this.urlCotizar, body, httpOptions);
  }
  misCotizaciones(forceRefresh = false) {
    if(!this.internet){
      return from(this.cacheS.getCachedRequest(this.urlMisCotizaciones));
    }
    const httpOptions = this.refrecarToken();
    if (forceRefresh) {
      return this.getPetitionCache(this.urlMisCotizaciones, httpOptions);
    } else {
      const storedValue = from(this.cacheS.getCachedRequest(this.urlMisCotizaciones));
      return storedValue.pipe(
        switchMap((res) => {
          if (res) {
            return of(res);
          } else {
            return this.getPetitionCache(this.urlMisCotizaciones, httpOptions);
          }
        })
      );
    }
  }
  registroGoogle(google: any) {
    return this.http.post<any>(this.registroG, google);
  }
  crearPass(pass: any) {
    const httpOptions = this.refrecarToken();
    return this.http.post<any>(this.urlCrearPass, pass, httpOptions);
  }
  refrecarToken() {
    const jwt = localStorage.getItem('_t_s');
    const headersO = new HttpHeaders().set('Authorization', 'Bearer ' + jwt);
    const httpOptions = {
      headers: headersO,
    };
    return httpOptions;
  }
  getPetitionCache(url, httpOpts): Observable<any> {
    return this.http.get(url, httpOpts).pipe(
      tap((res) => {
        this.cacheS.cacheRequest(url, res);
      })
    );
  }
}
