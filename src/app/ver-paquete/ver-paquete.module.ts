import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPaquetePageRoutingModule } from './ver-paquete-routing.module';
import { IonicHeaderParallaxModule } from 'ionic-header-parallax';
import { VerPaquetePage } from './ver-paquete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPaquetePageRoutingModule,
    IonicHeaderParallaxModule
  ],
  declarations: [VerPaquetePage]
})
export class VerPaquetePageModule {}
