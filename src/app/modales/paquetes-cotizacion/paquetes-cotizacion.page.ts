import { Component, Input, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paquetes-cotizacion',
  templateUrl: './paquetes-cotizacion.page.html',
  styleUrls: ['./paquetes-cotizacion.page.scss'],
})
export class PaquetesCotizacionPage implements OnInit {
  paquetes = [];
  urlPublica = environment.urlPublic + 'banners/';
  constructor(public navParams: NavParams) {
    this.paquetes = this.navParams.get('paquetes');
  }

  ngOnInit() {}
}
