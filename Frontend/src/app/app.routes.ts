import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
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
import { InicioComponent } from './components/inicio/inicio';
import { MenuService } from './services/menu.service';
import { Auth } from './services/auth';

export const rolProcesoGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const menuService = inject(MenuService);
  const router = inject(Router);

  if (!auth.getUser()) {
    return router.createUrlTree(['/inicio']);
  }

  // Si los menús del rol activo ya fueron cargados, validar que el enlace pertenezca al rol seleccionado
  if (menuService.isMenusLoaded() && !menuService.isRutaPermitida(state.url)) {
    return router.createUrlTree(['/inicio']);
  }

  return true;
};

export const routes: Routes = [
  { 
    path: '', 
    component: Layout,
    children: [
      { path: '', component: InicioComponent },
      { path: 'inicio', component: InicioComponent },
      { path: 'modificar-fotos', component: ModificarFotos },
      { path: 'gestion-usuarios', component: GestionUsuarios, canActivate: [rolProcesoGuard] },
      { path: 'gestion-areas', component: GestionAreas, canActivate: [rolProcesoGuard] },
      { path: 'gestion-editoriales', component: GestionEditoriales, canActivate: [rolProcesoGuard] },
      { path: 'gestion-tipos', component: GestionTipos, canActivate: [rolProcesoGuard] },
      { path: 'gestion-autores', component: GestionAutores, canActivate: [rolProcesoGuard] },
      { path: 'gestion-textos', component: GestionTextos, canActivate: [rolProcesoGuard] },
      { path: 'gestion-ejemplares', component: GestionEjemplares, canActivate: [rolProcesoGuard] },
      { path: 'gestion-prestamos', component: GestionPrestamos, canActivate: [rolProcesoGuard] },
      { path: 'gestion-devoluciones', component: GestionDevoluciones, data: { tab: 'registrar' }, canActivate: [rolProcesoGuard] },
      { path: 'anulacion-devoluciones', component: GestionDevoluciones, data: { tab: 'historial' }, canActivate: [rolProcesoGuard] },
      { path: 'gestion-roles', component: GestionRoles, canActivate: [rolProcesoGuard] },
      { path: 'gestion-menus', component: GestionMenus, canActivate: [rolProcesoGuard] },
      { path: 'asignar-mepro', component: AsignarMepro, canActivate: [rolProcesoGuard] },
      { path: 'asignar-rolme', component: AsignarRolme, canActivate: [rolProcesoGuard] },
      { path: 'asignar-rolusu', component: AsignarRolusu, canActivate: [rolProcesoGuard] }
    ]
  },
  { path: '**', redirectTo: '' }
];
