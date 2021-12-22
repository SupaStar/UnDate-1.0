import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit {
  direcciones: any;
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {
    this.direcciones = JSON.parse(localStorage.getItem('_n_dt_d'));
  }

  ngOnInit() {
    console.log(this.direcciones);
  }
  cerrarModal() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
  nuevaDireccion() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
    this.navCtrl.navigateRoot('/nuevaDireccion');
  }
}
