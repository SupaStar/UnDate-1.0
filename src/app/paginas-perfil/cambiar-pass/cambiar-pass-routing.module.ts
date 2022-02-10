import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarPassPage } from './cambiar-pass.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarPassPageRoutingModule {}
