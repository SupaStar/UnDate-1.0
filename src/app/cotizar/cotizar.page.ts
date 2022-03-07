import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-cotizar',
  templateUrl: './cotizar.page.html',
  styleUrls: ['./cotizar.page.scss'],
})
export class CotizarPage implements OnInit {
  carrito: [];
  direccion: any;
  direcciones = [];
  fechaMin = format(new Date(), 'yyyy-MM-dd');
  fechaDeseada: any;
  fechaDeseadaFormateada: any;
  personas = 1;
  notificacion = true;
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: SesionService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
    this.carrito = JSON.parse(localStorage.getItem('car_tems'));
    this.direcciones = JSON.parse(localStorage.getItem('_n_dt_d'));
  }

  ngOnInit() {
    this.direccionPrincipal();
  }
  tabs() {
    this.navCtrl.navigateBack('/tabs/inicio');
  }
  direccionPrincipal() {
    const direcciones = JSON.parse(localStorage.getItem('_n_dt_d'));
    this.direccion = direcciones.find((d) => d.default === true);
  }
  default(id) {
    const direcciones = JSON.parse(localStorage.getItem('_n_dt_d'));
    const nuevasDirecciones = [];
    direcciones.forEach((d) => {
      if (d.id === id) {
        d = { ...d, ...{ default: true } };
        this.direccion = d;
      } else {
        d = { ...d, ...{ default: false } };
      }
      nuevasDirecciones.push(d);
    });
    localStorage.setItem('_n_dt_d', JSON.stringify(nuevasDirecciones));
  }
  cotizar() {
    if (this.direcciones.length === 0) {
      const alerta = this.alertCtrl.create({
        header: 'Error',
        message: 'Agregue una direccion para poder continuar.',
        buttons: ['OK'],
      });
      alerta.then((alert) => alert.present());
    } else if (!this.fechaDeseada) {
      const alerta = this.alertCtrl.create({
        header: 'Error',
        message: 'Seleccione una fecha',
        buttons: ['OK'],
      });
      alerta.then((alert) => alert.present());
    } else {
      this.loadingCtrl
        .create({
          message: 'Cargando...',
        })
        .then((overlay) => {
          overlay.present();
          this.authService
            .cotizar(
              this.carrito,
              this.direccion.id,
              this.fechaDeseada,
              this.personas
            )
            .subscribe(
              (res) => {
                overlay.dismiss();
                localStorage.setItem('car_tems', JSON.stringify([]));
                this.presentToast('Cotización enviada', 'success');
                this.navCtrl.navigateRoot('/tabs/inicio');
              },
              (err) => {
                overlay.dismiss();
                this.presentToast(
                  'Error, esperar y volver a intentar, si el problema persiste contactar a soporte.',
                  'danger'
                );
              }
            );
        });
    }
  }
  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }
  nuevaDireccion() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
    this.navCtrl.navigateRoot('/nuevaDireccion');
  }
  formatoFecha() {
    this.fechaDeseadaFormateada = format(
      parseISO(this.fechaDeseada),
      'HH:mm, MMM d, yyyy',
      {
        locale: es,
      }
    );
  }
  aumentoPersonas() {
    if (this.personas >= 20 && this.notificacion === true) {
      this.alertCtrl
        .create({
          header: 'Error',
          message: 'Se generara una notificación al administrador',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      this.notificacion = false;
    }
    if (this.personas < 20 && this.notificacion === false) {
      this.notificacion = true;
    }
  }
}
