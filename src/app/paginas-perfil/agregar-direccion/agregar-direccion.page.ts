/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SesionService } from 'src/app/services/sesion.service';
@Component({
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.page.html',
  styleUrls: ['./agregar-direccion.page.scss'],
})
export class AgregarDireccionPage implements OnInit {
  direccionForm = this.fb.group({
    nombre: ['', Validators.required],
    calle: ['', Validators.required],
    numero: ['', Validators.required],
    cp: ['', Validators.required],
    estado: ['', Validators.required],
    municipio: ['', Validators.required],
    colonia: ['', Validators.required],
    entre_calles: ['', Validators.required],
    tipo: ['0', Validators.required],
    referencia: [''],
  });
  selColonia = false;
  colonias = [];
  agregar = true;
  editar = false;
  constructor(
    private navCtrl: NavController,
    private authService: SesionService,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.selColonia = true;
    if (this.authService.idEditarDireccion !== null) {
      this.editar = true;
      this.agregar = false;
      const direcciones = JSON.parse(localStorage.getItem('_n_dt_d'));
      const direccion = direcciones.find(
        (d) => d.id === this.authService.idEditarDireccion
      );
      this.direccionForm.setValue({
        nombre: direccion.nombre,
        calle: direccion.calle,
        numero: direccion.numero,
        cp: direccion.cp,
        estado: direccion.estado,
        municipio: direccion.municipio,
        colonia: direccion.colonia,
        entre_calles: direccion.entre_calles,
        tipo: direccion.tipo,
        referencia: direccion.referencia,
      });
      this.codigoP();
    }
  }

  tabs() {
    this.authService.idEditarDireccion = null;
    this.navCtrl.navigateRoot('/tabs/perfil');
  }
  codigoP() {
    if (this.direccionForm.controls.cp.value.toString().length === 5) {
      this.loadingCtrl
        .create({
          message: 'Buscando...',
        })
        .then((loading) => {
          loading.present();
          this.authService.buscarPorCp(this.direccionForm.value.cp).subscribe(
            (res: any) => {
              loading.dismiss();
              if (res.status) {
                if (res.data[0].municipio.estado.nombre !== 'Guanajuato') {
                  this.alertCtrl
                    .create({
                      header: '¡Atención!',
                      message:
                        'Aun no contamos con servicio fuera de guanajuato, por favor contactar con soporte',
                      buttons: [
                        {
                          text: 'Ok',
                          handler: () => {
                            this.direccionForm.controls.cp.setValue('');
                          },
                        },
                      ],
                    })
                    .then((alert) => {
                      alert.present();
                    });
                } else {
                  if (res.data[0].municipio.nombre !== 'León') {
                    this.alertCtrl
                      .create({
                        header: '¡Atención!',
                        message:
                          'Fuera del municipio de leon, agregamos un extra por transporte',
                        buttons: [
                          {
                            text: 'Ok',
                            handler: () => {
                              this.direccionForm.controls.estado.setValue(
                                res.data[0].Entidad
                              );
                              this.direccionForm.controls.municipio.setValue(
                                res.data[0].Municipio
                              );
                              this.colonias = res.data;
                              this.selColonia = false;
                            },
                          },
                        ],
                      })
                      .then((alert) => {
                        alert.present();
                      });
                  } else {
                    this.direccionForm.controls.estado.setValue(
                      res.data[0].municipio.estado.nombre
                    );
                    this.direccionForm.controls.municipio.setValue(
                      res.data[0].municipio.nombre
                    );
                    this.colonias = res.data;
                    this.selColonia = false;
                  }
                }
              } else {
                let error = '';
                res.errors.forEach((element) => {
                  error += element + '\n';
                });
                this.presentToast(error, 'danger');
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
      this.reiniciarForm(
        this.direccionForm.controls.nombre.value,
        this.direccionForm.controls.cp.value
      );
    }
  }
  reiniciarForm(nombreR, cpR) {
    this.direccionForm.setValue({
      nombre: nombreR,
      calle: '',
      numero: '',
      cp: cpR,
      estado: '',
      municipio: '',
      colonia: '',
      entre_calles: '',
      tipo: '0',
      referencia: '',
    });
  }
  async presentToast(mensaje, colors) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: colors,
    });
    toast.present();
  }
  guardarDireccion() {
    this.loadingCtrl
      .create({
        message: 'Guardando...',
      })
      .then((loading) => {
        loading.present();
        this.authService.agregarDireccion(this.direccionForm.value).subscribe(
          (res: any) => {
            loading.dismiss();
            if (res.status) {
              const objDireccion = {
                id: res.dt_id,
                ...this.direccionForm.value,
              };
              const direccionesG = JSON.parse(localStorage.getItem('_n_dt_d'));
              direccionesG.push(objDireccion);
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
        const objDireccion = {
          id: this.authService.idEditarDireccion,
          ...this.direccionForm.value,
        };
        this.authService.editarDireccion(objDireccion).subscribe(
          (res: any) => {
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
  // async loadMap() {}
  // async getPosition() {
  //   const position = await Geolocation.getCurrentPosition();
  //   // const lat = position.coords.latitude;
  //   // const lng = position.coords.longitude;
  // }
}
