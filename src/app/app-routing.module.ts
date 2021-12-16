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
    loadChildren: () => import('./paginas-perfil/editar/editar.module').then( m => m.EditarPageModule)
  },
  {
    path: 'paquete',
    loadChildren: () => import('./ver-paquete/ver-paquete.module').then( m => m.VerPaquetePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
