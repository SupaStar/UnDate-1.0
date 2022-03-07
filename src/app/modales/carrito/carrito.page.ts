import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit, AfterViewInit {
  @ViewChild('btnCotizar') btnCotizar: ElementRef;
  carrito: any;
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.carrito = JSON.parse(localStorage.getItem('car_tems'));
  }
  ngAfterViewInit() {
    const el=this.btnCotizar.nativeElement;
    setTimeout(() => {
      el.setAttribute('style', 'position: fixed; bottom: 51vh;');
    }, 200);
  }
  cerrarModal() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
  cotizar() {
    this.cerrarModal();
    this.navCtrl.navigateRoot('/cotizar');
  }
  eliminar(indice) {
    this.carrito.splice(indice, 1);
    localStorage.setItem('car_tems', JSON.stringify(this.carrito));
    if (this.carrito.length === 0) {
      this.cerrarModal();
    }
  }
}
