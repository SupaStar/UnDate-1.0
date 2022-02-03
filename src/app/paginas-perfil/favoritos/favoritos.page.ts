import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
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
    private toastController: ToastController
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
  cargarFavoritos() {
    this.authService.favoritos().subscribe(
      (data) => {
        this.favoritos = data.favoritos.map((paquete) => ({
          ...paquete,
          fav: true,
        }));
        this.cargando = false;
      },
      (error) => {
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
              if (paquete.id === id) {
                paquete.fav = true;
              }
            });
            favoritos.push(data.fav);
          } else {
            this.favoritos.forEach((paquete) => {
              if (paquete.id === id) {
                paquete.fav = false;
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
  async presentToast(mensaje, colors) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: colors,
    });
    toast.present();
  }
}
