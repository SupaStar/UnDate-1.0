import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carrito: any;
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.carrito = JSON.parse(localStorage.getItem('car_tems'));
  }
  cerrarModal() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
  cotizar() {
    this.cerrarModal();
    this.navCtrl.navigateForward('/cotizar');
  }
  eliminar(indice) {
    this.carrito.splice(indice, 1);
    localStorage.setItem('car_tems', JSON.stringify(this.carrito));
    if(this.carrito.length === 0){
      this.cerrarModal();
    }
  }
}
