import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { DireccionesPage } from './modales/direcciones/direcciones.page';
import { CarritoPage } from './modales/carrito/carrito.page';
import { PaquetesCotizacionPage } from './modales/paquetes-cotizacion/paquetes-cotizacion.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Drivers } from '@ionic/storage';
import { Network } from '@awesome-cordova-plugins/network/ngx';
@NgModule({
  declarations: [
    AppComponent,
    DireccionesPage,
    CarritoPage,
    PaquetesCotizacionPage,
  ],
  entryComponents: [DireccionesPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    IonicStorageModule.forRoot({
      // eslint-disable-next-line no-underscore-dangle
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB]
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScreenOrientation,
    GooglePlus,
    PhotoViewer,
    Network
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
