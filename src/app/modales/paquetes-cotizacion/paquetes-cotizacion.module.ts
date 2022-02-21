import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaquetesCotizacionPageRoutingModule } from './paquetes-cotizacion-routing.module';

import { PaquetesCotizacionPage } from './paquetes-cotizacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaquetesCotizacionPageRoutingModule,
  ],
  declarations: [PaquetesCotizacionPage]
})
export class PaquetesCotizacionPageModule {}
