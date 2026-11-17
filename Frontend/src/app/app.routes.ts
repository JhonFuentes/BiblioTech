import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { ModificarFotos } from './components/modificar-fotos/modificar-fotos';
import { GestionUsuarios } from './components/gestion-usuarios/gestion-usuarios';
import { GestionAreas } from './components/gestion-areas/gestion-areas';
import { GestionEditoriales } from './components/gestion-editoriales/gestion-editoriales';
import { GestionTipos } from './components/gestion-tipos/gestion-tipos';
import { GestionAutores } from './components/gestion-autores/gestion-autores';
import { GestionTextos } from './components/gestion-textos/gestion-textos';
import { GestionEjemplares } from './components/gestion-ejemplares/gestion-ejemplares';
import { GestionPrestamos } from './components/gestion-prestamos/gestion-prestamos';
import { GestionDevoluciones } from './components/gestion-devoluciones/gestion-devoluciones';
import { GestionRoles } from './components/gestion-roles/gestion-roles';
import { GestionMenus } from './components/gestion-menus/gestion-menus';
import { AsignarMepro } from './components/asignar-mepro/asignar-mepro';
import { AsignarRolme } from './components/asignar-rolme/asignar-rolme';
import { AsignarRolusu } from './components/asignar-rolusu/asignar-rolusu';
import { CatalogoDigital } from './components/catalogo-digital/catalogo-digital';
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
      { path: 'gestion-autores', component: GestionAutores },
      { path: 'gestion-textos', component: GestionTextos },
      { path: 'gestion-ejemplares', component: GestionEjemplares },
      { path: 'gestion-prestamos', component: GestionPrestamos },
      { path: 'gestion-devoluciones', component: GestionDevoluciones },
      { path: 'gestion-roles', component: GestionRoles },
      { path: 'gestion-menus', component: GestionMenus },
      { path: 'asignar-mepro', component: AsignarMepro },
      { path: 'asignar-rolme', component: AsignarRolme },
      { path: 'asignar-rolusu', component: AsignarRolusu },
      { path: 'catalogo-digital', component: CatalogoDigital }
    ]
  },
  { path: '**', redirectTo: '' }
];
