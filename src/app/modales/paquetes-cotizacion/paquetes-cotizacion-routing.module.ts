import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaquetesCotizacionPage } from './paquetes-cotizacion.page';

const routes: Routes = [
  {
    path: '',
    component: PaquetesCotizacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaquetesCotizacionPageRoutingModule {}
