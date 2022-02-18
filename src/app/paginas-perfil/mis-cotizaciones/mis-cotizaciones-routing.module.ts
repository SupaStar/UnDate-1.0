import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisCotizacionesPage } from './mis-cotizaciones.page';

const routes: Routes = [
  {
    path: '',
    component: MisCotizacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisCotizacionesPageRoutingModule {}
