import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AnimationController,
  IonInfiniteScroll,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CarritoPage } from '../modales/carrito/carrito.page';
import { PaquetesService } from '../services/paquetes.service';
import { SesionService } from '../services/sesion.service';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { Share } from '@capacitor/share';
import { Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  urlApi = environment.urlPublic + 'banners/';
  categorias: any;
  paquetesCompletos: any;
  paquetes: any;
  carrito = false;
  nProductos = 0;
  filtro = 0;
  paquetesFiltrados = [];
  constructor(
    private paquetesService: PaquetesService,
    public loadingController: LoadingController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private authService: SesionService,
    private fotos: PhotoViewer,
    private animacion: AnimationController
  ) {
    this.carrito = false;
    const carritoLocal = JSON.parse(localStorage.getItem('car_tems'));
    if (carritoLocal.length > 0) {
      this.nProductos = carritoLocal.length;
      this.carrito = true;
    }
    const categoriasStorage = JSON.parse(localStorage.getItem('cats_paq'));
    this.categorias = categoriasStorage;
  }
  filtrar(event) {
    if (event.detail.value === '0') {
      this.paquetesFiltrados = this.paquetesCompletos;
      this.paquetes = this.paquetesFiltrados.slice(0, 10);
    } else {
      this.paquetesFiltrados = this.paquetesCompletos.filter(
        (paquete) => paquete.id_categoria.toString() === event.detail.value
      );
      this.paquetes = this.paquetesFiltrados.slice(0, 10);
    }
  }
  favoritos(id) {
    const animation = this.animacion.create();
    animation.addElement(document.querySelector('#favorito' + id));
    animation.duration(500);
    animation.iterations(Infinity);
    animation.fromTo('transform', 'scale(0.5)', 'scale(1)');
    animation.play();
    this.authService.favorite(id).subscribe(
      (data) => {
        if (data.status) {
          let favoritos = JSON.parse(localStorage.getItem('fav_usr'));
          if (data.fav !== true) {
            this.paquetesCompletos.forEach((paquete) => {
              if (paquete.id === id) {
                paquete.favorito = true;
                return;
              }
            });
            favoritos.push(data.fav);
          } else {
            this.paquetesCompletos.forEach((paquete) => {
              if (paquete.id === id) {
                paquete.favorito = false;
              }
            });
            favoritos = favoritos.filter(
              (item) => item.paquete_id !== id
            );
          }
          animation.destroy();
          const animation2 = this.animacion.create();
          animation2.addElement(document.querySelector('#favorito' + id));
          animation2.duration(500);
          animation2.fromTo('transform', 'scale(1.5)', 'scale(1)');
          animation2.play();
          localStorage.setItem(
            'paquetes_cargados',
            JSON.stringify(this.paquetesCompletos)
          );
          localStorage.setItem('fav_usr', JSON.stringify(favoritos));
          this.presentToast(data.message, 'success');
        } else {
          this.presentToast(data.message, 'danger');
        }
      },
      (error) => {
        this.presentToast(
          'Error con el servidor, por favor contactar con soporte',
          'danger'
        );
      }
    );
  }
  cargar(forzado = false, evento = null) {
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.paquetesService.getPaquetes(forzado).subscribe(
          (data) => {
            if (data.status) {
              const favoritos = JSON.parse(localStorage.getItem('fav_usr'));
              this.paquetesCompletos = data.paquetes.map((paquete) => ({
                ...paquete,
                favorito: favoritos.find(
                  (item) => item.paquete_id === paquete.id
                )
                  ? true
                  : false,
              }));
              this.paquetes = this.paquetesCompletos.slice(0, 10);
              localStorage.setItem(
                'paquetes_cargados',
                JSON.stringify(this.paquetesCompletos)
              );
            } else {
              let errorC = '';
              data.message.forEach((element) => {
                errorC += element + '\n';
              });
              this.presentToast(errorC, 'danger');
            }
            if (evento) {
              evento.target.complete();
            }
            loading.dismiss();
          },
          (error) => {
            if (evento) {
              evento.target.complete();
            }
            loading.dismiss();
            this.presentToast(
              'Error con el servidor, por favor contactar con soporte',
              'danger'
            );
          }
        );
      });
  }
  ngOnInit() {
    const paquetesStorage = JSON.parse(
      localStorage.getItem('paquetes_cargados')
    );
    if (paquetesStorage.length === 0) {
      this.cargar(true);
    } else {
      this.paquetesCompletos = paquetesStorage;
      this.paquetes = this.paquetesCompletos.slice(0, 10);
    }
  }

  cargarMas(event) {
    if (this.filtro === 0) {
      // setTimeout(() => {
      const faltantes = this.paquetesCompletos.length - this.paquetes.length;
      if (faltantes <= 0) {
        event.target.complete();
        this.infiniteScroll.disabled = true;
        return;
      }
      const start = this.paquetes.length;
      this.paquetes = this.paquetes.concat(
        this.paquetesCompletos.slice(start, start + 5)
      );
      event.target.complete();
      if (this.paquetes.length === this.paquetesCompletos.length) {
        event.target.disabled = true;
      }
      // }, 2000);
    } else {
      // setTimeout(() => {
      const faltantes = this.paquetesFiltrados.length - this.paquetes.length;
      if (faltantes <= 0) {
        event.target.complete();
        this.infiniteScroll.disabled = true;
        return;
      }
      const start = this.paquetes.length;
      this.paquetes = this.paquetes.concat(
        this.paquetesFiltrados.slice(start, start + 5)
      );
      event.target.complete();
      if (this.paquetes.length === this.paquetesFiltrados.length) {
        event.target.disabled = true;
      }
      // }, 2000);
    }
  }
  verPaquete(id) {
    localStorage.setItem('paquete_id', id);
    const paqueteE = this.paquetesCompletos.find(
      (paquete) => paquete.id === id
    );
    localStorage.setItem('img_ban', paqueteE.imagenes[0].ruta);
    localStorage.setItem(
      'paquetes_cargados',
      JSON.stringify(this.paquetesCompletos)
    );
    this.navCtrl.navigateRoot('/paquete');
  }
  async presentToast(mensaje, colors) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
  async verCarrito() {
    const modal = this.modalCtrl.create({
      component: CarritoPage,
      swipeToClose: true,
      mode: 'ios',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5],
    });
    (await modal).present();
    await (await modal).onWillDismiss().then((data) => {
      const carritoLocal = JSON.parse(localStorage.getItem('car_tems'));
      if (carritoLocal.length > 0) {
        this.nProductos = carritoLocal.length;
        this.carrito = true;
      } else {
        this.nProductos = 0;
        this.carrito = false;
      }
    });
  }
  verImagenes(id, indiceImg) {
    const paqueteE = this.paquetesCompletos.find(
      (paquete) => paquete.id === id
    );
    const imagenesPrueba = [];
    paqueteE.imagenes.forEach((imagen) => {
      imagenesPrueba.push({ url: this.urlApi + imagen.ruta });
    });
    Filesystem.checkPermissions().then((result) => {
      if (result.publicStorage !== 'granted') {
        this.presentToast(
          'No se otogra permisos de almacenamiento\nPor favor otorgarlos mediante la configuración.',
          'danger'
        );
      }
    });
    this.fotos.show(imagenesPrueba[indiceImg].url, paqueteE.titulo, {
      share: true,
    });
  }
  async compartir() {
    await Share.share({
      title: 'Compartir',
      text: 'Really awesome thing you need to see right meow', //Arriba
      url: 'http://ionicframework.com/', //Abajo
      dialogTitle: 'Comparte con tus amigos.',
    });
  }
}
