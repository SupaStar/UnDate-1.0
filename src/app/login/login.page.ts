/* eslint-disable no-underscore-dangle */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AnimationController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SesionService } from '../services/sesion.service';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { Directory, Filesystem } from '@capacitor/filesystem';
const CACHE_FOLDER = 'CACHED-IMG';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('inputEmail') inputEmail: ElementRef;
  @ViewChild('passwordEyeRegister', { read: ElementRef })
  passwordEye: ElementRef;
  passwordTypeInput = 'password';
  usuario: any;
  mostrar = false;
  constructor(
    private authService: SesionService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private navCtrl: NavController,
    private animationCtrl: AnimationController,
    private googlePlus: GooglePlus
  ) {
    this.restablecerFormulario();
    const token = localStorage.getItem('_t_s');
    if (token) {
      window.location.href = './tabs/inicio';
    }
  }
  restablecerFormulario() {
    this.usuario = {
      id: 0,
      email: '',
      password: '',
    };
  }
  ngOnInit() {}
  login() {
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.authService.iniciarSesion(this.usuario).subscribe(
          (data) => {
            if (data.status) {
              localStorage.clear();
              localStorage.setItem('dark', 'null');
              localStorage.setItem('fav_usr', JSON.stringify(data.fav_usr));
              localStorage.setItem(
                'cats_paq',
                JSON.stringify(data.cat_paq_reg)
              );
              localStorage.setItem('paquetes_cargados', JSON.stringify([]));
              localStorage.setItem('_t_s', data.token);
              localStorage.setItem('_n_dt_nam', data._n_dt.nombres);
              localStorage.setItem('_n_dt_ap', data._n_dt.apellidos);
              localStorage.setItem('_n_dt_id', data._n_dt.id);
              localStorage.setItem('_n_dt_em', data._n_dt.email);
              localStorage.setItem('_n_dt_t', data._n_dt.telefono);
              const direcciones = data.direcciones;
              if (direcciones.length > 0) {
                direcciones[0] = { ...direcciones[0], ...{ default: true } };
              }
              localStorage.setItem('_n_dt_d', JSON.stringify(direcciones));
              localStorage.setItem('pass?', 'false');
              localStorage.setItem('car_tems', JSON.stringify([]));
              loading.dismiss();
              this.createCacheFolder();
              this.navCtrl.navigateRoot('/tabs/inicio');
            } else {
              let errorC = '';
              data.errors.forEach((element) => {
                errorC += element + '\n';
              });
              loading.dismiss();
              this.presentToast(errorC, 'danger');
            }
          },
          (error) => {
            loading.dismiss();
            this.presentToast(
              'Error con el servidor, por favor contactar con soporte',
              'danger'
            );
          }
        );
      });
  }
  async createCacheFolder() {
    await Filesystem.mkdir({
      directory: Directory.Cache,
      path: `CACHED-IMG`,
    });
  }
  async presentToast(mensaje, colors) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
  registro() {
    this.navCtrl.navigateForward('/registro');
  }
  async reiniciarPassword() {
    if (this.usuario.email !== '') {
      localStorage.setItem('_t_mail', this.usuario.email);
    }
    this.navCtrl.navigateForward('/reiniciarPass');
  }
  togglePasswordMode() {
    this.passwordTypeInput =
      this.passwordTypeInput === 'text' ? 'password' : 'text';
    const nativeEl = this.passwordEye.nativeElement.querySelector('input');
    const inputSelection = nativeEl.selectionStart;
    nativeEl.focus();
    setTimeout(() => {
      nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);
  }
  async lG() {
    this.googlePlus
      .login({})
      .then((res) => {
        this.authService.registroGoogle(res).subscribe(
          (data) => {
            if (data.status) {
              if (data.creado) {
                this.toastController
                  .create({
                    message: 'Usuario creado correctamente',
                    duration: 2000,
                    color: 'success',
                  })
                  .then((toast) => toast.present());
              } else {
                this.toastController
                  .create({
                    message: 'Inicio de sesión correcto',
                    duration: 2000,
                    color: 'success',
                  })
                  .then((toast) => toast.present());
              }
              localStorage.clear();
              localStorage.setItem('dark', 'null');
              localStorage.setItem('fav_usr', JSON.stringify(data.fav_usr));
              localStorage.setItem(
                'cats_paq',
                JSON.stringify(data.cat_paq_reg)
              );
              localStorage.setItem('paquetes_cargados', JSON.stringify([]));
              localStorage.setItem('_t_s', data.token);
              localStorage.setItem('_n_dt_nam', data._n_dt.nombres);
              localStorage.setItem('_n_dt_ap', data._n_dt.apellidos);
              localStorage.setItem('_n_dt_id', data._n_dt.id);
              localStorage.setItem('_n_dt_em', data._n_dt.email);
              localStorage.setItem('_n_dt_t', data._n_dt.telefono);
              const direcciones = data.direcciones;
              if (direcciones.length > 0) {
                direcciones[0] = { ...direcciones[0], ...{ default: true } };
              }
              localStorage.setItem('_n_dt_d', JSON.stringify(direcciones));
              localStorage.setItem('car_tems', JSON.stringify([]));
              localStorage.setItem(
                'pass?',
                data.pass === true ? 'true' : 'false'
              );
              localStorage.setItem('g_log', 'true');
              this.createCacheFolder();
              this.navCtrl.navigateRoot('/tabs/inicio');
            } else {
              let errorC = '';
              data.errors.forEach((element) => {
                errorC += element + '\n';
              });
              this.presentToast(errorC, 'danger');
            }
          },
          (error) => {
            this.presentToast(
              'Error con el servidor, por favor contactar con soporte',
              'danger'
            );
          }
        );
      })
      .catch((err) => console.error(err));
  }
}
