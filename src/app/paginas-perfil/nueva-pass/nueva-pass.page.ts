/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-nueva-pass',
  templateUrl: './nueva-pass.page.html',
  styleUrls: ['./nueva-pass.page.scss'],
})
export class NuevaPassPage implements OnInit {
  newPass: FormGroup = this.fb.group({});

  constructor(
    private navController: NavController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private authProv: SesionService,
    private fb: FormBuilder
  ) {
    this.newPass = this.fb.group(
      {
        email: [localStorage.getItem('m_us_change')],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: [
          '',
          [Validators.required, Validators.minLength(6)],
        ],
        code: [localStorage.getItem('m_us_change_int')],
      },
      {
        validators: this.checkPasswords('password', 'password_confirmation'),
      }
    );
  }

  ngOnInit() {
    this.newPass.controls.password.setValue('');
    this.newPass.controls.password_confirmation.setValue('');
  }
  cambioPass() {
    this.navController.navigateBack('/codigoCambio');
  }
  cambiarPass() {
    if (this.newPass.valid) {
      this.loadingController
        .create({
          message: 'Cargando...',
        })
        .then((loading) => {
          loading.present();
          this.authProv.newPassword(this.newPass.value).subscribe(
            (data) => {
              if (data.status) {
                this.presentToast(data.message, 'success');
                localStorage.clear();
                this.navController.navigateRoot('/');
                loading.dismiss();
              } else {
                let errorC = '';
                data.errors.forEach((element) => {
                  errorC += element + '\n';
                });
                this.presentToast(errorC, 'danger');
                loading.dismiss();
              }
            },
            (error) => {
              this.presentToast(
                'Error al cambiar contraseña, intente nuevamente',
                'danger'
              );
              loading.dismiss();
            }
          );
        });
    }
  }
  async presentToast(mensaje, colors) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
  checkPasswords(controlName: string, matchingControlName: string){
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
    }
}
}
