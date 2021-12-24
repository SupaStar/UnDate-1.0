/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation';
import { SesionService } from 'src/app/services/sesion.service';
@Component({
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.page.html',
  styleUrls: ['./agregar-direccion.page.scss'],
})
export class AgregarDireccionPage implements OnInit {
  direccion = {
    id: '',
    nombre: '',
    calle: '',
    numero: '',
    cp: '',
    estado: '',
    municipio: '',
    colonia: '',
    instrucciones: '',
    entre_calles: '',
    referencia: '',
  };
  selColonia = false;
  colonias = [];
  agregar = true;
  editar = false;
  constructor(
    private navCtrl: NavController,
    private authService: SesionService,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.reiniciarForm('', '');
    if (this.authService.idEditarDireccion !== null) {
      this.editar = true;
      this.agregar = false;
      const direcciones = JSON.parse(localStorage.getItem('_n_dt_d'));
      this.direccion = direcciones.find(
        (d) => d.id === this.authService.idEditarDireccion
      );
    }
  }
  async getPosition() {
    const position = await Geolocation.getCurrentPosition();
    // const lat = position.coords.latitude;
    // const lng = position.coords.longitude;
  }
  tabs() {
    this.authService.idEditarDireccion = null;
    this.navCtrl.navigateRoot('/tabs/perfil');
  }
  codigoP() {
    if (this.direccion.cp.toString().length === 5) {
      this.loadingCtrl
        .create({
          message: 'Buscando...',
        })
        .then((loading) => {
          loading.present();
          this.authService.buscarPorCp(this.direccion.cp).subscribe(
            (res: any) => {
              loading.dismiss();
              if (res.status) {
                if (res.data.Descripcion !== undefined) {
                  this.presentToast(res.data.Descripcion, 'danger');
                } else {
                  if (res.data[0].Entidad !== 'GUANAJUATO') {
                    this.alertCtrl
                      .create({
                        header: '¡Atención!',
                        message:
                          'Aun no contamos con servicio fuera de esta entidad',
                        buttons: [
                          {
                            text: 'Ok',
                            handler: () => {
                              this.direccion.cp = '';
                            },
                          },
                        ],
                      })
                      .then((alert) => {
                        alert.present();
                      });
                  } else {
                    if (res.data[0].Municipio !== 'LEON') {
                      this.alertCtrl
                        .create({
                          header: '¡Atención!',
                          message:
                            'Fuera del municipio de leon, agregamos un extra por transporte',
                          buttons: [
                            {
                              text: 'Ok',
                              handler: () => {
                                this.direccion.estado = res.data[0].Entidad;
                                this.direccion.municipio =
                                  res.data[0].Municipio;
                                this.colonias = res.data;
                                this.selColonia = false;
                              },
                            },
                          ],
                        })
                        .then((alert) => {
                          alert.present();
                        });
                    }
                    this.direccion.estado = res.data[0].Entidad;
                    this.direccion.municipio = res.data[0].Municipio;
                    this.colonias = res.data;
                    this.selColonia = false;
                  }
                }
              } else {
                this.presentToast(
                  'Error con el servidor, por favor contactar con soporte',
                  'danger'
                );
              }
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
      this.reiniciarForm(this.direccion.cp, this.direccion.nombre);
    }
  }
  async presentToast(mensaje, colors) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
  reiniciarForm(cpA, nombreA) {
    this.direccion = {
      id: '',
      nombre: nombreA,
      calle: '',
      numero: '',
      cp: cpA,
      estado: '',
      municipio: '',
      colonia: '',
      instrucciones: '',
      entre_calles: '',
      referencia: '',
    };
    this.selColonia = true;
  }
  guardarDireccion() {
    this.loadingCtrl
      .create({
        message: 'Guardando...',
      })
      .then((loading) => {
        loading.present();
        this.authService.agregarDireccion(this.direccion).subscribe(
          (res: any) => {
            loading.dismiss();
            if (res.status) {
              this.direccion.id = res.dt_id;
              const direccionesG = JSON.parse(localStorage.getItem('_n_dt_d'));
              direccionesG.push(this.direccion);
              localStorage.setItem('_n_dt_d', JSON.stringify(direccionesG));
              this.presentToast(res.message, 'success');
              this.tabs();
            } else {
              let errorC = '';
              res.errors.forEach((element) => {
                errorC += element + '\n';
              });
              this.presentToast(errorC, 'danger');
            }
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
  editarDireccion() {
    this.loadingCtrl
      .create({
        message: 'Guardando...',
      })
      .then((loading) => {
        loading.present();
        this.authService
          .editarDireccion(this.direccion)
          .subscribe((res: any) => {
            loading.dismiss();
            if (res.status) {
              localStorage.setItem('_n_dt_d', JSON.stringify(res.direcciones));
              this.presentToast('Direccion modificada con exito', 'success');
              this.tabs();
            } else {
              let errorC = '';
              res.errors.forEach((element) => {
                errorC += element + '\n';
              });
              this.presentToast(errorC, 'danger');
            }
          }, (error) => {
            loading.dismiss();
            this.presentToast(
              'Error con el servidor, por favor contactar con soporte',
              'danger'
            );
      });
    });
  }
  async loadMap() {}
}
