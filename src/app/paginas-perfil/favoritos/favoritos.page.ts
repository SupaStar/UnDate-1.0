import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { CachingService } from 'src/app/services/caching.service';
import { SesionService } from 'src/app/services/sesion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos = [];
  urlPublica = environment.urlPublic + 'banners/';
  cargando = false;
  sinFav = false;
  constructor(
    private navCtrl: NavController,
    private authService: SesionService,
    private toastController: ToastController,
    private cacheS: CachingService
  ) {
    if (localStorage.getItem('fav_usr').length > 0) {
      this.cargando = true;
    } else {
      this.sinFav = true;
    }
  }

  ngOnInit() {
    this.cargarFavoritos();
  }
  inicio() {
    this.navCtrl.navigateBack('/tabs/perfil');
  }
  cargarFavoritos(forzado=false,evento=null) {
    this.authService.favoritos(forzado).subscribe(
      (data) => {
        if (data.favoritos.length === 0) {
          this.sinFav = true;
        } else {
          this.favoritos = data.favoritos.map((paquete) => ({
            ...paquete,
            fav: true,
          }));
          this.sinFav=false;
        }
        this.cargando = false;
        localStorage.setItem('fav_usr', JSON.stringify(this.favoritos));
        if(evento){
          evento.target.complete();
        }
      },
      (error) => {
        if(evento){
          evento.target.complete();
        }
        this.presentToast(
          'Error con el servidor, por favor contactar con soporte',
          'danger'
        );
        this.cargando = false;
      }
    );
  }
  verPaquete(id) {
    localStorage.setItem('paquete_id', id);
    let paqueteE = this.favoritos.find((paquete) => paquete.paquete_id === id);
    paqueteE = paqueteE.paquete;
    this.authService.idPackFavorite = paqueteE.id;
    localStorage.setItem('img_ban', paqueteE.imagenes[0].ruta);
    this.navCtrl.navigateForward('/paquete');
  }
  editFavorito(id) {
    this.authService.favorite(id).subscribe(
      (data) => {
        if (data.status) {
          let favoritos = JSON.parse(localStorage.getItem('fav_usr'));
          if (data.fav !== true) {
            this.favoritos.forEach((paquete) => {
              if (paquete.paquete_id === id) {
                paquete.fav = true;
                return;
              }
            });
            favoritos.push(data.fav);
          } else {
            this.favoritos.forEach((paquete) => {
              if (paquete.paquete_id === id) {
                paquete.fav = false;
              }
            });
            favoritos = favoritos.filter(
              (item) => item.paquete_id !== id
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
  async presentToast(mensaje, colors) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
}
