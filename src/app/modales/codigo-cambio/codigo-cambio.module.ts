import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigoCambioPageRoutingModule } from './codigo-cambio-routing.module';

import { CodigoCambioPage } from './codigo-cambio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigoCambioPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CodigoCambioPage]
})
export class CodigoCambioPageModule {}
