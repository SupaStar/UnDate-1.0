import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { PaquetesService } from '../services/paquetes.service';
import { environment } from 'src/environments/environment';
import { SesionService } from '../services/sesion.service';

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
    private authService: SesionService
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
    this.authService.favorite(id).subscribe(
      (data) => {
        if (data.status) {
          let favoritos = JSON.parse(localStorage.getItem('fav_usr'));
          if (data.fav !== true) {
            this.paquetes.forEach((paquete) => {
              if (paquete.id === id) {
                paquete.favorito = true;
              }
            });
            favoritos.push(data.fav);
          } else {
            this.paquetes.forEach((paquete) => {
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
}
