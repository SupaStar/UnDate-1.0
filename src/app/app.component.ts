import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.modoOscuro();
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
}
