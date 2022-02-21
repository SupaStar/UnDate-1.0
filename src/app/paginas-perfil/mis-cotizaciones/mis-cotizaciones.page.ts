import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PaquetesCotizacionPage } from 'src/app/modales/paquetes-cotizacion/paquetes-cotizacion.page';
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
  paquetes = [];
  constructor(
    private navCtrl: NavController,
    private authServ: SesionService,
    private modalCtrl: ModalController
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
          res.cotizaciones = res.cotizaciones.map((cotizacion) => {
            const fechaD = new Date(cotizacion.fechaDeseada);
            cotizacion.fechaDeseada = fechaD.toLocaleDateString('es-ES');
            const fecha = new Date(cotizacion.created_at);
            cotizacion.created_at = fecha.toLocaleDateString('es-ES');
            if (cotizacion.fechaCotizacion !== null) {
              const fechaCotizacion = new Date(cotizacion.fechaCotizacion);
              cotizacion.fechaCotizacion =
                fechaCotizacion.toLocaleDateString('es-ES');
            }
            return cotizacion;
          });
          this.cotizaciones = res.cotizaciones;
        }
      },
      (err) => {
        this.cargando = false;
        this.ninguna = true;
      }
    );
  }
  detalles(id) {
    //sheet modal paquetes cotizacion
    const cotizacion = this.cotizaciones.find(
      (cotizacionn) => cotizacionn.id === id
    );
    this.modalCtrl
      .create({
        component: PaquetesCotizacionPage,
        componentProps: {
          paquetes: cotizacion.paquetes_cotizacion,
        },
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.5, 1],
      })
      .then((modal) => {
        modal.present();
      });
  }
}
