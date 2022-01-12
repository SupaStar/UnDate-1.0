import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodigoCambioPage } from './codigo-cambio.page';

const routes: Routes = [
  {
    path: '',
    component: CodigoCambioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodigoCambioPageRoutingModule {}
