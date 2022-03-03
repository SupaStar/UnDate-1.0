import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearPassPage } from './crear-pass.page';

const routes: Routes = [
  {
    path: '',
    component: CrearPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearPassPageRoutingModule {}
