import { Component, OnInit, ViewChild } from '@angular/core';
import {
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
    private authService: SesionService
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
    this.authService.favorite(id).subscribe(
      (data) => {
        if (data.status) {
          let favoritos = JSON.parse(localStorage.getItem('fav_usr'));
          if (data.fav !== true) {
            this.paquetesCompletos.forEach((paquete) => {
              if (paquete.id === id) {
                paquete.favorito = true;
              }
            });
            favoritos.push(data.fav);
          } else {
            this.paquetesCompletos.forEach((paquete) => {
              if (paquete.id === id) {
                paquete.favorito = false;
              }
            });
            favoritos = favoritos.splice(
              0,
              favoritos.find((item) => item.paquete_id === id)
            );
          }
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
  cargar() {
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.paquetesService.getPaquetes().subscribe(
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
  ngOnInit() {
    const paquetesStorage = JSON.parse(
      localStorage.getItem('paquetes_cargados')
    );
    if (paquetesStorage.length === 0) {
      this.cargar();
    } else {
      this.paquetesCompletos = paquetesStorage;
      this.paquetes = this.paquetesCompletos.slice(0, 10);
    }
  }
  refrescar(event) {
    this.paquetesService.getPaquetes().subscribe(
      (data) => {
        if (data.status) {
          this.infiniteScroll.disabled = false;
          const favoritos = JSON.parse(localStorage.getItem('fav_usr'));
          this.paquetesCompletos = data.paquetes.map((paquete) => ({
            ...paquete,
            favorito: favoritos.find((item) => item.paquete_id === paquete.id)
              ? true
              : false,
          }));
          this.paquetes = this.paquetesCompletos.slice(0, 5);
          localStorage.setItem('cats_paq', JSON.stringify(data.cat_paq_reg));
          this.categorias = data.cat_paq_reg;
        } else {
          let errorC = '';
          data.message.forEach((element) => {
            errorC += element + '\n';
          });
          this.presentToast(errorC, 'danger');
        }
        event.target.complete();
      },
      (error) => {
        event.target.complete();
        this.presentToast(
          'Error con el servidor, por favor contactar con soporte',
          'danger'
        );
      }
    );
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
      if (this.paquetes.length === 10) {
        event.target.disabled = true;
      }
      // }, 2000);
    } else {
      setTimeout(() => {
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
        if (this.paquetes.length === 10) {
          event.target.disabled = true;
        }
      }, 2000);
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
}
