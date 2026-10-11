import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { ModificarFotos } from './components/modificar-fotos/modificar-fotos';
import { GestionUsuarios } from './components/gestion-usuarios/gestion-usuarios';
import { InicioComponent } from './components/inicio/inicio';

export const routes: Routes = [
  { 
    path: '', 
    component: Layout,
    children: [
      { path: '', component: InicioComponent },
      { path: 'inicio', component: InicioComponent },
      { path: 'modificar-fotos', component: ModificarFotos },
      { path: 'gestion-usuarios', component: GestionUsuarios }
    ]
  },
  { path: '**', redirectTo: '' }
];
