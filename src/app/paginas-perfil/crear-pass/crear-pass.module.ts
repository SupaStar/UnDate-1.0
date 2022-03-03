import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearPassPageRoutingModule } from './crear-pass-routing.module';

import { CrearPassPage } from './crear-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearPassPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearPassPage]
})
export class CrearPassPageModule {}
