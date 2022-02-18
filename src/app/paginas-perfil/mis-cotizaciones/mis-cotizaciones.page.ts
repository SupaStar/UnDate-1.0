import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-mis-cotizaciones',
  templateUrl: './mis-cotizaciones.page.html',
  styleUrls: ['./mis-cotizaciones.page.scss'],
})
export class MisCotizacionesPage implements OnInit {
  cargando = true;
  ninguna = false;
  cotizaciones = [];
  constructor(
    private navCtrl: NavController,
    private authServ: SesionService
  ) {}

  ngOnInit() {
    this.cargarCotizaciones();
  }
  tabs() {
    this.navCtrl.back();
  }
  cargarCotizaciones() {
    this.authServ.misCotizaciones().subscribe(
      (res: any) => {
        this.cargando = false;
        if (res.cotizaciones.length === 0) {
          this.ninguna = true;
        } else {
          this.cotizaciones = res.cotizaciones;
        }
      },
      (err) => {
        this.cargando = false;
        this.ninguna = true;
      }
    );
  }
}
