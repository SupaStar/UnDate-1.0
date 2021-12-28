import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarDireccionPageRoutingModule } from './agregar-direccion-routing.module';

import { AgregarDireccionPage } from './agregar-direccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarDireccionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AgregarDireccionPage]
})
export class AgregarDireccionPageModule {}
