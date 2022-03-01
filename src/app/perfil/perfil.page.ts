import { Component, OnInit } from '@angular/core';
import {
  IonRouterOutlet,
  ModalController,
  NavController,
} from '@ionic/angular';
import { DireccionesPage } from '../modales/direcciones/direcciones.page';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { Directory, Filesystem } from '@capacitor/filesystem';

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
  tema = 'false';
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    public routerOutlet: IonRouterOutlet,
    private googlePlus: GooglePlus
  ) {
    this.tema = localStorage.getItem('dark');
    this.usuario.nombre = localStorage.getItem('_n_dt_nam');
    this.usuario.apellido = localStorage.getItem('_n_dt_ap');
  }

  ngOnInit() {}
  cambiarTema() {
    if (this.tema === 'false') {
      document.body.classList.toggle('dark', false);
      localStorage.setItem('dark', 'false');
    } else if (this.tema === 'null') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      document.body.classList.toggle('dark', prefersDark.matches);
      localStorage.setItem('dark', 'null');
    } else {
      document.body.classList.toggle('dark', true);
      localStorage.setItem('dark', 'true');
    }
  }
  async cerrarSesion() {
    const fileEntries = await Filesystem.readdir({
      directory: Directory.Cache,
      path: 'CACHED-IMG',
    });
    fileEntries.files.map(async (f) => {
      console.log('Delete: ', f);
      await Filesystem.deleteFile({
        directory: Directory.Cache,
        path: `CACHED-IMG/${f}`,
      });
    });
    const glog = localStorage.getItem('g_log');
    if (glog === 'true') {
      this.googlePlus.logout();
    }
    localStorage.clear();
    this.navCtrl.navigateRoot('/');
  }
  async direcciones() {
    const modal = this.modalCtrl.create({
      component: DireccionesPage,
      swipeToClose: true,
      mode: 'ios',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
    });
    return await (await modal).present();
  }
  cuenta() {
    this.navCtrl.navigateRoot('/editar');
  }
  favoritos() {
    this.navCtrl.navigateForward('/favoritos');
  }
  pass() {
    this.navCtrl.navigateForward('/cambiarPass');
  }
  cotizaciones() {
    this.navCtrl.navigateForward('/misCotizaciones');
  }
}
