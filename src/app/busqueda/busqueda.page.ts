import { Component, OnInit } from '@angular/core';
import {
  AnimationController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { PaquetesService } from '../services/paquetes.service';
import { environment } from 'src/environments/environment';
import { SesionService } from '../services/sesion.service';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.page.html',
  styleUrls: ['./busqueda.page.scss'],
})
export class BusquedaPage implements OnInit {
  busqueda: '';
  paquetes: any;
  urlApi = environment.urlPublic + 'banners/';
  constructor(
    private paquetesService: PaquetesService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private authService: SesionService,
    private fotos: PhotoViewer,
    private animacion: AnimationController
  ) {}

  ngOnInit() {}
  onSearchChange(event) {
    if (this.busqueda.length <= 0) {
      this.paquetes = [];
      return;
    }
    this.paquetesService.buscar(event.detail.value).subscribe(
      (data) => {
        const favoritos = JSON.parse(localStorage.getItem('fav_usr'));
        this.paquetes = data.paquetes.map((paquete) => ({
          ...paquete,
          favorito: favoritos.find((item) => item.paquete_id === paquete.id)
            ? true
            : false,
        }));
      },
      (error) => {
        this.presentToast(
          'Error con el servidor, contactar con soporte.',
          'danger'
        );
      }
    );
  }
  verPaquete(id) {
    localStorage.setItem('paquete_id', id);
    const paqueteE = this.paquetes.find((paquete) => paquete.id === id);
    this.authService.idPackFavorite = 'owo';
    localStorage.setItem('img_ban', paqueteE.imagenes[0].ruta);
    this.navCtrl.navigateForward('/paquete');
  }
  async presentToast(mensaje, colors) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
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
            this.paquetes.forEach((paquete) => {
              if (paquete.id === id) {
                paquete.favorito = true;
                return;
              }
            });
            favoritos.push(data.fav);
          } else {
            this.paquetes.forEach((paquete) => {
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
  verImagenes(id, indiceImg) {
    const paqueteE = this.paquetes.find((paquete) => paquete.id === id);
    const imagenesPrueba = [];
    paqueteE.imagenes.forEach((imagen) => {
      imagenesPrueba.push({ url: this.urlApi + imagen.ruta });
    });
    this.fotos.show(imagenesPrueba[indiceImg].url, paqueteE.titulo, {
      share: true,
    });
  }
}
