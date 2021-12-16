import { Component, OnInit } from '@angular/core';
import {
  IonRouterOutlet,
  ModalController,
  NavController,
} from '@ionic/angular';
import { DireccionesPage } from '../modales/direcciones/direcciones.page';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario = {
    nombre: '',
    apellido: '',
  };
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {
    this.usuario.nombre = localStorage.getItem('_n_dt_nam');
    this.usuario.apellido = localStorage.getItem('_n_dt_ap');
  }
  cerrarSesion() {
    localStorage.clear();
    this.navCtrl.navigateRoot('/');
  }
  async direcciones() {
    const modal = this.modalCtrl.create({
      component: DireccionesPage,
      swipeToClose: true,
      mode: 'ios',
      initialBreakpoint: 0.5,
      breakpoints:[0, 0.5, 1]
    });
    return await (await modal).present();
  }
  cuenta() {
    this.navCtrl.navigateForward('/editar');
  }
}
