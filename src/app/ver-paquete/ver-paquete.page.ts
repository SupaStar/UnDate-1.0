/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AlertController,
  IonHeader,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { PaquetesService } from '../services/paquetes.service';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-ver-paquete',
  templateUrl: './ver-paquete.page.html',
  styleUrls: ['./ver-paquete.page.scss'],
})
export class VerPaquetePage implements OnInit {
  //@ViewChild('toolbar') tool: ElementRef;
  imgban = '';
  inicio = true;
  favoritos = false;
  busqueda = false;
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
    private alertCtrl: AlertController,
    private authService: SesionService
  ) {
    if (this.authService.idPackFavorite === null) {
      this.inicio = true;
      this.favoritos = false;
      this.busqueda = false;
    } else if (this.authService.idPackFavorite === 'owo') {
      this.inicio = false;
      this.favoritos = false;
      this.busqueda = true;
    } else {
      this.favoritos = true;
      this.inicio = false;
      this.busqueda = false;
    }
    this.id = Number(localStorage.getItem('paquete_id'));
    this.urlExtras = environment.urlPublic + 'extras/';
    this.urlApi = environment.urlPublic + 'banners/';
    this.imgban = this.urlApi + localStorage.getItem('img_ban');
    this.extrasAnadidos = [];
  }

  ngOnInit() {
    this.cargarPaquete();
  }
  imagenPrueba() {
    setTimeout(() => {
      const imageOverlay = document.getElementById('tool').shadowRoot;
      const b = imageOverlay.childNodes[0].childNodes[0];
      console.log(b);
      b.addEventListener('click', () => {
        console.log('click');
      });
      console.log(b);
    }, 200);
  }
  prueba2(item) {
    console.log(item[0]);
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
              this.imagenPrueba();
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
    if (this.inicio) {
      this.navCtrl.navigateBack('/tabs/inicio');
    } else if (this.busqueda) {
      this.authService.idPackFavorite = null;
      this.navCtrl.navigateBack('/tabs/busqueda');
    } else {
      this.authService.idPackFavorite = null;
      this.navCtrl.navigateBack('/favoritos');
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
  agregarExtra(id) {
    if (this.extrasAnadidos.indexOf(id) === -1) {
      this.extrasAnadidos.push(this.paquete.extras.find((e) => e.id === id));
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
      paquete: this.paquete,
      extras: this.extrasAnadidos,
      cantidad: 1,
      montNight: this.montNightV,
    };
    carritos.push(itemCarrito);
    localStorage.setItem('car_tems', JSON.stringify(carritos));
    this.navCtrl.back();
  }
  imagen() {
    console.log('imagen xd');
  }
}
