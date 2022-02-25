import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AppCenterCrashes } from '@awesome-cordova-plugins/app-center-crashes/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public screenOrientation: ScreenOrientation,
    private appCrash: AppCenterCrashes
  ) {
    this.modoOscuro();
    this.bloquearPantalla();
    this.logCrash();
  }
  logCrash() {
    this.appCrash.setEnabled(true).then(() => {
      this.appCrash.lastSessionCrashReport().then((report) => {
        console.log('Crash report', report);
      });
    });
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
}
