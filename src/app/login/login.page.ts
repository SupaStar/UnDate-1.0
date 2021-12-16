/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: any;
  constructor(
    private authService: SesionService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private navCtrl: NavController,
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
        this.authService.iniciarSesion(this.usuario).subscribe((data) => {
          if (data.status) {
            localStorage.setItem('_t_s', data.token);
            localStorage.setItem('_n_dt_nam', data._n_dt.nombres);
            localStorage.setItem('_n_dt_ap', data._n_dt.apellidos);
            localStorage.setItem('_n_dt_id', data._n_dt.id);
            localStorage.setItem('_n_dt_em', data._n_dt.email);
            localStorage.setItem('_n_dt_t', data._n_dt.telefono);
            loading.dismiss();
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
        });
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
  registro(){
    this.navCtrl.navigateForward('/registro');
  }
}
