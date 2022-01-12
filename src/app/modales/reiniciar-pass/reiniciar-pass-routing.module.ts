import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReiniciarPassPage } from './reiniciar-pass.page';

const routes: Routes = [
  {
    path: '',
    component: ReiniciarPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReiniciarPassPageRoutingModule {}
