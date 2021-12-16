/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation';
@Component({
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.page.html',
  styleUrls: ['./agregar-direccion.page.scss'],
})
export class AgregarDireccionPage implements OnInit {

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.getPosition();
    this.loadMap();
  }
  async getPosition() {
    const position = await Geolocation.getCurrentPosition();
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
  }
  tabs() {
    this.navCtrl.navigateRoot('/tabs/perfil');
  }
  async loadMap() {
  }
}
