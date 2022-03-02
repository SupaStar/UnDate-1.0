import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public screenOrientation: ScreenOrientation,
    private alertCtrl: AlertController
  ) {
    this.modoOscuro();
    this.bloquearPantalla();
    this.permisos();
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
    let permiso = true;
    Filesystem.checkPermissions().then((result) => {
      if (result.publicStorage !== 'granted') {
        while (permiso) {
          Filesystem.requestPermissions().then((result2) => {
            if (result2.publicStorage === 'granted') {
              permiso = false;
            } else {
              this.alertCtrl
                .create({
                  header: 'Permisos',
                  message:
                    'No se pudo acceder a la memoria interna, por favor acepte los permisos',
                  buttons: [
                    {
                      text: 'Aceptar',
                    },
                  ],
                })
                .then((alert) => {
                  alert.present();
                });
            }
          });
        }
      }
    });
  }
}
