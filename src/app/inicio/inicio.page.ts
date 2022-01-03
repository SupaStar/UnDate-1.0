import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonInfiniteScroll,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { PaquetesService } from '../services/paquetes.service';

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

  constructor(
    private paquetesService: PaquetesService,
    public loadingController: LoadingController,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {
    this.categorias = [
      {
        icono: 'candy-cane',
        nombre: 'Navidad',
      },
      {
        icono: 'birthday-cake',
        nombre: 'Cumpleaños',
      },
      {
        icono: 'gift',
        nombre: 'Regalos',
      },
      {
        icono: 'fan',
        nombre: 'Flores',
      },
      {
        icono: 'ring',
        nombre: 'Pedida',
      },
    ];
  }

  ngOnInit() {
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.paquetesService.getPaquetes().subscribe(
          (data) => {
            if (data.status) {
              this.paquetesCompletos = data.paquetes;
              this.paquetes = this.paquetesCompletos.slice(0, 10);
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
  refrescar(event) {
    this.loadingController
      .create({
        message: 'Cargando...',
      })
      .then((loading) => {
        loading.present();
        this.paquetesService.getPaquetes().subscribe((data) => {
          if (data.status) {
            this.infiniteScroll.disabled=false;
            this.paquetesCompletos = data.paquetes;
            this.paquetes = this.paquetesCompletos.slice(0, 5);
          } else {
            let errorC = '';
            data.message.forEach((element) => {
              errorC += element + '\n';
            });
            this.presentToast(errorC, 'danger');
          }
          loading.dismiss();
          event.target.complete();
        },
        (error) => {
          loading.dismiss();
          event.target.complete();
          this.presentToast(
            'Error con el servidor, por favor contactar con soporte',
            'danger'
          );
        });
      });
  }
  cargarMas(event) {
    console.log('Cargando siguiente...');
    setTimeout(() => {
      const faltantes=this.paquetesCompletos.length-this.paquetes.length;
      if(faltantes<=0){
        event.target.complete();
        this.infiniteScroll.disabled=true;
        return;
      }
      const start = this.paquetes.length;
      this.paquetes = this.paquetes.concat(this.paquetesCompletos.slice(start, start + 5));
      event.target.complete();
      if (this.paquetes.length === 10) {
        event.target.disabled = true;
      }
    }, 2000);
  }
  verPaquete(id) {
    localStorage.setItem('paquete_id', id);
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
}
