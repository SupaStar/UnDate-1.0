import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-reiniciar-pass',
  templateUrl: './reiniciar-pass.page.html',
  styleUrls: ['./reiniciar-pass.page.scss'],
})
export class ReiniciarPassPage implements OnInit {
  usuario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  constructor(
    private navController: NavController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private authProv: SesionService,
    private fb: FormBuilder
  ) {
    const mail = localStorage.getItem('_t_mail');
    if (mail) {
      this.usuario.controls.email.setValue(mail);
    }
  }

  ngOnInit() {}
  login() {
    this.navController.navigateBack('/');
  }
  reiniciarPass() {
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.authProv.requestResetPassword(this.usuario.value).subscribe(
          (data) => {
            if (data.status) {
              loading.dismiss();
              localStorage.setItem('m_us_change', this.usuario.value.email);
              localStorage.setItem('m_us_change_int', data.n_int);
              this.navController.navigateForward('/codigoCambio');
            } else {
              loading.dismiss();
              let error = '';
              data.errors.forEach((element) => {
                error += element + '\n';
              });
              this.presentToast(error, 'danger');
            }
          },
          (err) => {
            loading.dismiss();
            this.presentToast('El correo no existe', 'danger');
          }
        );
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
}
