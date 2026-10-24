import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { ModificarFotos } from './components/modificar-fotos/modificar-fotos';
import { GestionUsuarios } from './components/gestion-usuarios/gestion-usuarios';
import { GestionAreas } from './components/gestion-areas/gestion-areas';
import { GestionEditoriales } from './components/gestion-editoriales/gestion-editoriales';
import { GestionTipos } from './components/gestion-tipos/gestion-tipos';
import { GestionAutores } from './components/gestion-autores/gestion-autores';
import { InicioComponent } from './components/inicio/inicio';

export const routes: Routes = [
  { 
    path: '', 
    component: Layout,
    children: [
      { path: '', component: InicioComponent },
      { path: 'inicio', component: InicioComponent },
      { path: 'modificar-fotos', component: ModificarFotos },
      { path: 'gestion-usuarios', component: GestionUsuarios },
      { path: 'gestion-areas', component: GestionAreas },
      { path: 'gestion-editoriales', component: GestionEditoriales },
      { path: 'gestion-tipos', component: GestionTipos },
      { path: 'gestion-autores', component: GestionAutores }
    ]
  },
  { path: '**', redirectTo: '' }
];

