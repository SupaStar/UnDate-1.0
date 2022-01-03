/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { PaquetesService } from '../services/paquetes.service';

@Component({
  selector: 'app-ver-paquete',
  templateUrl: './ver-paquete.page.html',
  styleUrls: ['./ver-paquete.page.scss'],
})
export class VerPaquetePage implements OnInit {
  currentPosition;
  height;
  minimumThreshold = 100;
  startPosition = 0;
  maximumHeight = 0;
  id: number;
  paquete = {
    id: 0,
    titulo: '',
    banner: '',
    descripcion: '',
    categoria: '',
    imagenes: [
      {
        ruta: '',
      },
    ],
    extras: [],
  };
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  montNightV = false;
  extrasAnadidos = [];
  carrusel = false;
  urlApi: any;
  urlExtras: any;
  urlPublic: any;
  constructor(
    private navCtrl: NavController,
    private paqueteService: PaquetesService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertCtrl: AlertController
  ) {
    this.id = Number(localStorage.getItem('paquete_id'));
    this.urlExtras = environment.urlPublic + 'extras/';
    this.urlApi = environment.urlPublic + 'banners/';
    this.extrasAnadidos = [];
  }

  ngOnInit() {
    this.cargarPaquete();
    // this.open();
  }
  open() {
    (<HTMLStyleElement>document.querySelector('.botonSheet')).style.bottom =
      '-13%';
    (<HTMLStyleElement>document.querySelector('.bg')).style.display = 'bottom';
  }
  movimiento(evt: TouchEvent) {
    if (this.startPosition === 0) {
      this.startPosition = evt.touches[0].clientY;
      this.maximumHeight = -(
        document.querySelector('.botonSheet').clientHeight * 0.14
      );
      this.minimumThreshold =
        document.querySelector('#imgPaquete').clientHeight * 0.09;
    }
    this.height = document.querySelector('.botonSheet').clientHeight;
    const y = evt.touches[0].clientY;
    this.currentPosition = y - this.startPosition;
    if (
      this.currentPosition > this.maximumHeight &&
      this.currentPosition < this.minimumThreshold
    ) {
      (<HTMLStyleElement>(
        document.querySelector('.botonSheet')
      )).style.transform =
        'translate3d(0px, ' + this.currentPosition + 'px, 0px)';
      // console.log(this.currentPosition);
    }
  }

  cargarPaquete() {
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.paqueteService.getPaquete(this.id).subscribe(
          (res) => {
            if (res.status) {
              this.paquete = res.paquete;
              if (this.paquete.imagenes.length > 0) {
                this.carrusel = true;
              }
            } else {
              let errorC = '';
              res.errors.forEach((element) => {
                errorC += element + '\n';
              });
              this.presentToast(errorC, 'danger');
              this.navCtrl.navigateBack('/tabs/inicio');
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
  tabs() {
    this.navCtrl.navigateBack('/tabs/inicio');
  }
  async presentToast(mensaje, colors) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
  agregarExtra(id) {
    if (this.extrasAnadidos.indexOf(id) === -1) {
      this.extrasAnadidos.push(id);
    } else {
      this.extrasAnadidos.splice(this.extrasAnadidos.indexOf(id), 1);
    }
  }
  montNight() {
    if (this.montNightV) {
      this.alertCtrl
        .create({
          header: '¿Desea agregar este extra?',
          message:
            'Se necesitara realizar una visita antes del evento, para corroborar el espacio',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                this.montNightV = false;
              },
            },
            {
              text: 'Agregar',
              handler: () => {
                this.montNightV = true;
              },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    }
  }
  agregarCarrito() {
    const carritos = JSON.parse(localStorage.getItem('car_tems'));
    const itemCarrito = {
      idPaquete: this.paquete.id,
      extras: this.extrasAnadidos,
      cantidad: 1,
      montNight: this.montNightV,
    };
    carritos.push(itemCarrito);
    localStorage.setItem('car_tems', JSON.stringify(carritos));
    this.navCtrl.back();
  }
}
