import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./registro/registro.module').then((m) => m.RegistroPageModule),
  },
  {
    path: 'nuevaDireccion',
    loadChildren: () =>
      import(
        './paginas-perfil/agregar-direccion/agregar-direccion.module'
      ).then((m) => m.AgregarDireccionPageModule),
  },
  {
    path: 'editar',
    loadChildren: () =>
      import('./paginas-perfil/editar/editar.module').then(
        (m) => m.EditarPageModule
      ),
  },
  {
    path: 'paquete',
    loadChildren: () =>
      import('./ver-paquete/ver-paquete.module').then(
        (m) => m.VerPaquetePageModule
      ),
  },
  {
    path: 'cotizar',
    loadChildren: () => import('./cotizar/cotizar.module').then( m => m.CotizarPageModule)
  },
  {
    path: 'reiniciarPass',
    loadChildren: () => import('./modales/reiniciar-pass/reiniciar-pass.module').then( m => m.ReiniciarPassPageModule)
  },
  {
    path: 'codigoCambio',
    loadChildren: () => import('./modales/codigo-cambio/codigo-cambio.module').then( m => m.CodigoCambioPageModule)
  },
  {
    path: 'nuevaPass',
    loadChildren: () => import('./paginas-perfil/nueva-pass/nueva-pass.module').then( m => m.NuevaPassPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./paginas-perfil/favoritos/favoritos.module').then( m => m.FavoritosPageModule)
  },
  {
    path: 'cambiarPass',
    loadChildren: () => import('./paginas-perfil/cambiar-pass/cambiar-pass.module').then( m => m.CambiarPassPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
