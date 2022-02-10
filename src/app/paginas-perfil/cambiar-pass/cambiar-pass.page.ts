import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-cambiar-pass',
  templateUrl: './cambiar-pass.page.html',
  styleUrls: ['./cambiar-pass.page.scss'],
})
export class CambiarPassPage implements OnInit {
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
        oldPass: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirmation: [
          '',
          [Validators.required, Validators.minLength(6)],
        ],
      },
      {
        validators: this.checkPasswords('password', 'passwordConfirmation'),
      }
    );
  }

  ngOnInit() {}
  perfil() {
    this.navController.navigateBack('/tabs/perfil');
  }
  checkPasswords(controlName: string, matchingControlName: string) {
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
  cambiar() {
    this.authProv.cambiarPassPerfil(this.newPass.value).subscribe(
      (data) => {
        if (data.status) {
          let mensaje = '';
          data.message.forEach((element) => {
            mensaje += element + '\n';
          });
          this.presentToast(mensaje, 'success');
          this.navController.navigateBack('/tabs/perfil');
        } else {
          let errores = '';
          data.errors.forEach((element) => {
            errores += element + '\n';
          });
          this.presentToast(errores, 'danger');
        }
      },
      (error) => {
        this.presentToast(
          'Error con el servidor, volver a intentar mas tarde.',
          'danger'
        );
      }
    );
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
