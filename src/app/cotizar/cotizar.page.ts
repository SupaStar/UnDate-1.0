import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cotizar',
  templateUrl: './cotizar.page.html',
  styleUrls: ['./cotizar.page.scss'],
})
export class CotizarPage implements OnInit {
  carrito: [];
  direccion: any;
  direcciones = [];
  constructor(private navCtrl: NavController) {
    this.carrito = JSON.parse(localStorage.getItem('car_tems'));
    this.direcciones = JSON.parse(localStorage.getItem('_n_dt_d'));
  }

  ngOnInit() {
    this.direccionPrincipal();
  }
  tabs() {
    this.navCtrl.navigateBack('/tabs/inicio');
  }
  direccionPrincipal() {
    const direcciones = JSON.parse(localStorage.getItem('_n_dt_d'));
    this.direccion = direcciones.find((d) => d.default === true);
    console.log(this.direccion);
  }
  default(id) {
    const direcciones = JSON.parse(localStorage.getItem('_n_dt_d'));
    const nuevasDirecciones = [];
    direcciones.forEach((d) => {
      if (d.id === id) {
        d = { ...d, ...{ default: true } };
        this.direccion = d;
      } else {
        d = { ...d, ...{ default: false } };
      }
      nuevasDirecciones.push(d);
    });
    localStorage.setItem('_n_dt_d', JSON.stringify(nuevasDirecciones));
  }
}
