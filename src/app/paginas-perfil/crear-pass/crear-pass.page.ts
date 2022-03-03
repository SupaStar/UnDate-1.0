import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-crear-pass',
  templateUrl: './crear-pass.page.html',
  styleUrls: ['./crear-pass.page.scss'],
})
export class CrearPassPage implements OnInit {
  primeraPass: FormGroup = this.fb.group({});

  constructor(
    private navController: NavController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private authProv: SesionService,
    private fb: FormBuilder
  ) {
    this.primeraPass = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.checkPasswords('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit() {}
  crear() {
    this.authProv.crearPass(this.primeraPass.value).subscribe(
      (data) => {
        if (data.status) {
          let mensaje = '';
          data.message.forEach((element) => {
            mensaje += element + '\n';
          });
          localStorage.setItem('pass?', 'false');
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
  async presentToast(mensaje, colors) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
  perfil() {
    this.navController.navigateBack('/tabs/perfil');
  }
}
