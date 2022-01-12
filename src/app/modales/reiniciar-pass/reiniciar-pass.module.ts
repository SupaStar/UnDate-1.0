import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReiniciarPassPageRoutingModule } from './reiniciar-pass-routing.module';

import { ReiniciarPassPage } from './reiniciar-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReiniciarPassPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ReiniciarPassPage]
})
export class ReiniciarPassPageModule {}
