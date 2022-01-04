import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cotizar',
  templateUrl: './cotizar.page.html',
  styleUrls: ['./cotizar.page.scss'],
})
export class CotizarPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}
  tabs() {
    this.navCtrl.navigateBack('/tabs/inicio');
  }
}
