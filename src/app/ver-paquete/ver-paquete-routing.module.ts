import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPaquetePage } from './ver-paquete.page';

const routes: Routes = [
  {
    path: '',
    component: VerPaquetePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPaquetePageRoutingModule {}
