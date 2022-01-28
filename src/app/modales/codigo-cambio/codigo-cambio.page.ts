import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  IonInput,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-codigo-cambio',
  templateUrl: './codigo-cambio.page.html',
  styleUrls: ['./codigo-cambio.page.scss'],
})
export class CodigoCambioPage implements OnInit {
  @ViewChildren(IonInput) inputs: IonInput[];
  arregloInputs = [];
  correo: any;
  intentos: any;
  espera = false;
  tiempoRestante: any;
  digitos = {
    n1: '',
    n2: '',
    n3: '',
    n4: '',
    n5: '',
    n6: '',
  };
  finalizado = false;

  constructor(
    private navController: NavController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private authProv: SesionService,
    private fb: FormBuilder
  ) {
    this.intentos = localStorage.getItem('m_us_change_int');
    this.correo = localStorage.getItem('m_us_change');
    this.cuentaRegresiva();
  }
  async cuentaRegresiva() {
    this.tiempoRestante = 60;
    const intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante === 0) {
        clearInterval(intervalo);
      }
    }, 1000);
  }
  ngOnInit() {}
  pegar(event) {
    const codigoPegado = event.clipboardData.getData('text/plain');
    if (codigoPegado.length === 6) {
      for (let i = 0; i < 6; i++) {
        const keys = Object.keys(this.digitos);
        this.digitos[keys[i]] = codigoPegado[i];
      }
    }
  }
  cambiar(event, numero) {
    if (!(this.arregloInputs.length > 0)) {
      for (const input of this.inputs) {
        this.arregloInputs.push(input);
      }
    }
    switch (numero) {
      case 0:
        if (!(this.arregloInputs[0].value.length < 1)) {
          this.arregloInputs[1].setFocus();
        } else {
          this.finalizado = false;
        }
        break;
      case 1:
        if (!(this.arregloInputs[1].value.length < 1)) {
          this.arregloInputs[2].setFocus();
        } else {
          this.finalizado = false;
        }
        break;
      case 2:
        if (!(this.arregloInputs[2].value.length < 1)) {
          this.arregloInputs[3].setFocus();
        } else {
          this.finalizado = false;
        }
        break;
      case 3:
        if (!(this.arregloInputs[3].value.length < 1)) {
          this.arregloInputs[4].setFocus();
        } else {
          this.finalizado = false;
        }
        break;
      case 4:
        if (!(this.arregloInputs[4].value.length < 1)) {
          this.arregloInputs[5].setFocus();
        } else {
          this.finalizado = false;
        }
        break;
      case 5:
        this.finalizado = true;
        break;
    }
  }
  validateCode() {
    const keys = Object.keys(this.digitos);
    let code = '';
    keys.forEach((key) => {
      code += this.digitos[key];
    });
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.authProv.validateCode(code).subscribe(
          (data) => {
            loading.dismiss();
            if (data.status === true) {
              localStorage.setItem('m_us_change_int', data.code);
              this.navController.navigateForward('/nuevaPass');
            } else {
              let error = '';
              data.errors.forEach((element) => {
                error += element + '\n';
              });
              this.presentToast(error, 'danger');
            }
          },
          (err) => {
            loading.dismiss();
            this.presentToast('Error de conexión', 'danger');
          }
        );
      });
  }

  cambioPass() {
    this.navController.navigateBack('/');
  }
  reenviarCodigo() {
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.authProv.requestResetPassword({ email: this.correo }).subscribe(
          (data) => {
            if (data.status) {
              loading.dismiss();
              this.presentToast(
                'Se ha enviado un código de verificación',
                'success'
              );
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
