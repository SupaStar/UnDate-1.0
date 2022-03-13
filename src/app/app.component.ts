import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { AlertController } from '@ionic/angular';
import { CachingService } from './services/caching.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public screenOrientation: ScreenOrientation,
    private alertCtrl: AlertController,
    private cacheService: CachingService
  ) {
    this.modoOscuro();
    this.bloquearPantalla();
    this.permisos();
    this.cache();
    this.imgsCache();
  }
  modoOscuro() {
    const preferencia = localStorage.getItem('dark');
    if (preferencia === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      document.body.classList.toggle('dark', prefersDark.matches);
      localStorage.setItem('dark', 'null');
    } else {
      if (preferencia === 'true') {
        document.body.classList.toggle('dark', true);
      } else if (preferencia === 'null') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        document.body.classList.toggle('dark', prefersDark.matches);
      } else {
        document.body.classList.toggle('dark', false);
      }
    }
  }
  bloquearPantalla() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
  permisos() {
    Filesystem.checkPermissions().then((result) => {
      if (result.publicStorage !== 'granted') {
        Filesystem.requestPermissions();
      }
    });
  }
  cache() {
    this.cacheService.initStorage();
  }
  async imgsCache() {
    await Filesystem.mkdir({
      directory: Directory.Cache,
      path: `CACHED-IMG`,
    });
  }
}
