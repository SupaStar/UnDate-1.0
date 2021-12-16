import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}
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
