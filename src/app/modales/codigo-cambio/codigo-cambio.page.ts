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

  constructor(
    private navController: NavController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private authProv: SesionService,
    private fb: FormBuilder
  ) {
    this.intentos = localStorage.getItem('m_us_change_int');
    this.correo = localStorage.getItem('m_us_change');
  }

  ngOnInit() {}
  cambiar(numero) {
    switch (numero) {
      case 0:
        setTimeout(() => {
          this.inputs[1].setFocus();
        },150);
        break;
      case 1:
        this.inputs[2].setFocus();
        break;
      case 2:
        this.inputs[3].setFocus();
        break;
      case 3:
        this.inputs[4].setFocus();
        break;
      case 4:
        this.inputs[5].setFocus();
        break;
      case 5:
        const finalizado = true;
        break;
    }
  }
  // async cuenta() {
  //   let segundosRestantes = this.intentos * 30;
  //   if(this.intentos-60>0){
  //     while(segundosRestantes>60){
  //     let minutosRestantes = Math.round(segundosRestantes/60);
  //     }
  //   }else{
  //     while(segundosRestantes>0){
  //       setTimeout(() => {
  //         segundosRestantes--;
  //         if(segundosRestantes<10){
  //           this.tiempoRestante = "00"+":0"+segundosRestantes;
  //         }else{
  //           this.tiempoRestante = "00"+":"+segundosRestantes;
  //         }
  //       }, 1000);
  //     }
  //   }
  // }
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
        this.authProv.requestResetPassword({ correo: this.correo }).subscribe(
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
