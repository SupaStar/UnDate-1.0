import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  usuario = {
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    password_confirmation: '',
  };
  constructor(
    private navController: NavController,
    private sesionService: SesionService,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  ngOnInit() {}
  login() {
    this.navController.navigateBack('/');
  }
  registro() {
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.sesionService.registrarUsuario(this.usuario).subscribe(
          (data) => {
            if (data.status) {
              this.presentToast(data.message, 'success');
              this.navController.navigateBack('/');
            }else{
              let errorC='';
              data.errors.forEach(element => {
                errorC+=element+'\n';
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
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
}
