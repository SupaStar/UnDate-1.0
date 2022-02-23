/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SesionService } from 'src/app/services/sesion.service';
import { Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  usuario: FormGroup;
  email = '';
  cambio = false;
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: SesionService,
    public toastCtrl: ToastController,
    private fb: FormBuilder
  ) {
    this.usuario = this.fb.group(
      {
        nombres: [localStorage.getItem('_n_dt_nam'), [Validators.required]],
        apellidos: [localStorage.getItem('_n_dt_ap'), [Validators.required]],
        telefono: [localStorage.getItem('_n_dt_t'), [Validators.required]],
        nombresM: [localStorage.getItem('_n_dt_nam'), [Validators.required]],
        apellidosM: [localStorage.getItem('_n_dt_ap'), [Validators.required]],
        telefonoM: [localStorage.getItem('_n_dt_t'), [Validators.required]],
      },
      {
        validator: [
          this.checkSame('nombres', 'nombresM'),
          this.checkSame('apellidos', 'apellidosM'),
          this.checkSame('telefono', 'telefonoM'),
        ],
      }
    );
    this.email = localStorage.getItem('_n_dt_em');
  }

  ngOnInit() {}
  tabs() {
    this.navCtrl.navigateRoot('/tabs/perfil');
  }
  actualizar() {
    this.loadingCtrl
      .create({
        message: 'Actualizando datos...',
      })
      .then((loading) => {
        loading.present();
        this.authService.actualizarUsuario(this.usuario.value).subscribe(
          (response) => {
            if (response.status) {
              localStorage.setItem(
                '_n_dt_nam',
                this.usuario.controls.nombres.value
              );
              localStorage.setItem(
                '_n_dt_ap',
                this.usuario.controls.apellidos.value
              );
              localStorage.setItem(
                '_n_dt_t',
                this.usuario.controls.telefono.value
              );
              this.usuario.controls.nombresM.setValue(
                this.usuario.controls.nombresM.value
              );
              this.usuario.controls.apellidosM.setValue(
                this.usuario.controls.apellidosM.value
              );
              this.usuario.controls.telefonoM.setValue(
                this.usuario.controls.telefonoM.value
              );
              this.usuario.controls.nombresM.setErrors(null);
              this.usuario.controls.apellidosM.setErrors(null);
              this.usuario.controls.telefonoM.setErrors(null);
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
          }
        );
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
  checkSame(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.same) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ same: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
