import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaPassPage } from './nueva-pass.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaPassPageRoutingModule {}
