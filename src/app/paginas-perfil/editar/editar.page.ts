/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SesionService } from 'src/app/services/sesion.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  usuario = {
    nombres: '',
    apellidos: '',
    telefono: '',
  };
  usuarioSinM = {
    nombres: '',
    apellidos: '',
    telefono: '',
  };
  email = '';

  cambio = false;
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: SesionService,
    public toastCtrl: ToastController,
    private platform: Platform
  ) {
    this.platform.keyboardDidShow.subscribe((ev) => {
      const { keyboardHeight } = ev;
    });
    this.usuario.nombres = localStorage.getItem('_n_dt_nam');
    this.usuario.apellidos = localStorage.getItem('_n_dt_ap');
    this.email = localStorage.getItem('_n_dt_em');
    this.usuario.telefono = localStorage.getItem('_n_dt_t');
    this.usuarioSinM.nombres = localStorage.getItem('_n_dt_nam');
    this.usuarioSinM.apellidos = localStorage.getItem('_n_dt_ap');
    this.usuarioSinM.telefono = localStorage.getItem('_n_dt_t');
  }

  ngOnInit() {}
  validar() {
    if (this.usuario.nombres !== this.usuarioSinM.nombres) {
      this.cambio = true;
      return;
    }
    if (this.usuario.apellidos !== this.usuarioSinM.apellidos) {
      this.cambio = true;
      return;
    }
    if (this.usuario.telefono !== this.usuarioSinM.telefono) {
      this.cambio = true;
      return;
    }
    if (this.cambio) {
      this.cambio = false;
      return;
    }
  }
  tabs() {
    this.navCtrl.navigateBack('/tabs/perfil');
  }
  actualizar() {
    this.loadingCtrl
      .create({
        message: 'Actualizando datos...',
      })
      .then((loading) => {
        loading.present();
        this.authService
          .actualizarUsuario(this.usuario)
          .subscribe((response) => {
            if (response.status) {
              localStorage.setItem('_n_dt_nam', this.usuario.nombres);
              localStorage.setItem('_n_dt_ap', this.usuario.apellidos);
              localStorage.setItem('_n_dt_t', this.usuario.telefono);
              this.cambio = false;
              this.presentToast(response.message, 'success');
            } else {
              let errorC = '';
              response.message.forEach((element) => {
                errorC += element + '\n';
              });
              this.presentToast(errorC, 'danger');
            }
            loading.dismiss();
          },
          (error) => {
            loading.dismiss();
            this.presentToast(
              'Error con el servidor, por favor contactar con soporte',
              'danger'
            );
          });
      });
  }
  async presentToast(mensaje, colors) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
}
