import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  @ViewChild('passwordEyeRegister', { read: ElementRef })
  passwordEye: ElementRef;
  @ViewChild('passwordEyeRegisterConfirm', { read: ElementRef })
  passwordEyeConfirm: ElementRef;
  passwordTypeInput = 'password';
  passwordConfirmTypeInput = 'password';


  usuario = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    password_confirmation: ['', [Validators.required, Validators.minLength(6)]],
  });
  constructor(
    private navController: NavController,
    private sesionService: SesionService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.usuario.reset();
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
  togglePasswordMode2() {
    this.passwordConfirmTypeInput =
      this.passwordConfirmTypeInput === 'text' ? 'password' : 'text';
    const nativeEl = this.passwordEyeConfirm.nativeElement.querySelector('input');
    const inputSelection = nativeEl.selectionStart;
    nativeEl.focus();
    setTimeout(() => {
      nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);
  }
  login() {
    this.navController.navigateBack('/');
  }
  registro() {
    if (this.usuario.valid) {
      this.loadingController
        .create({
          message: 'Cargando...',
        })
        .then((loading) => {
          loading.present();
          this.sesionService.registrarUsuario(this.usuario.value).subscribe(
            (data) => {
              if (data.status) {
                this.presentToast(
                  'Usuario creado con éxito, confirma tu correo para iniciar sesion.',
                  'success'
                );
                this.navController.navigateBack('/');
              } else {
                let errorC = '';
                data.errors.forEach((element) => {
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
    } else {
      this.presentToast('Por favor llene todos los campos', 'danger');
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
}
