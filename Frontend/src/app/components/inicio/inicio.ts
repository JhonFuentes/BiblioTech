import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { MenuService, Rol } from '../../services/menu.service';

export interface ModuloCard {
  categoria: string;
  badgeClass: string;
  titulo: string;
  descripcion: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-700">
      <!-- Banner de Bienvenida -->
      <div class="bg-gradient-to-r from-[#2A2F63] via-[#3E6D9C] to-[#5FB0C9] rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden mb-8">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="relative z-10 max-w-3xl">
          <div *ngIf="rolActivo" class="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            <lucide-icon name="shield-check" class="w-3.5 h-3.5 text-[#A7E0DB]"></lucide-icon>
            <span>Rol activo: {{ rolActivo.nombre }}</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Bienvenido, {{ usuario?.user || 'Invitado' }}
          </h1>
          <p class="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            Plataforma integral de gestión bibliotecaria: administración de usuarios y roles (RBAC), catálogo bibliográfico, inventario de ejemplares físicos, préstamos y devoluciones.
          </p>
          <div class="flex flex-wrap gap-3" *ngIf="usuario">
            <a *ngIf="puedeAcceder('/gestion-prestamos')" routerLink="/gestion-prestamos" 
              class="bg-white text-[#2A2F63] hover:bg-[#E3F6F5] font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2">
              <lucide-icon name="calendar" class="w-4 h-4 text-[#3E6D9C]"></lucide-icon> Préstamos de Ejemplares
            </a>
            <a *ngIf="puedeAcceder('/gestion-textos')" routerLink="/gestion-textos" 
              class="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition border border-white/20 flex items-center gap-2">
              <lucide-icon name="file-text" class="w-4 h-4"></lucide-icon> Gestión de Textos
            </a>
            <a *ngIf="puedeAcceder('/gestion-ejemplares')" routerLink="/gestion-ejemplares" 
              class="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition border border-white/20 flex items-center gap-2">
              <lucide-icon name="archive" class="w-4 h-4"></lucide-icon> Gestión de Ejemplares
            </a>
          </div>
        </div>
      </div>

      <!-- Módulos del Sistema filtrados dinámicamente según el Rol Activo -->
      <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 class="text-xl font-bold text-[#2A2F63] m-0">Módulos Habilitados para su Rol</h2>
          <p class="text-xs text-slate-500 m-0 mt-1">
            {{ rolActivo ? 'Mostrando únicamente los módulos autorizados para el rol ' + rolActivo.nombre : 'Inicie sesión para visualizar y acceder a los módulos asignados a su rol' }}
          </p>
        </div>
        <span *ngIf="rolActivo" class="inline-flex items-center gap-1.5 text-xs font-bold bg-[#E3F6F5] text-[#2A2F63] border border-[#A7E0DB] px-3 py-1.5 rounded-xl self-start sm:self-auto">
          {{ modulos.length }} módulo(s) disponible(s)
        </span>
      </div>

      <div *ngIf="modulos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <a *ngFor="let mod of modulos" [routerLink]="mod.ruta"
          class="group bg-white/80 hover:bg-white backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#E3F6F5] text-[#3E6D9C] flex items-center justify-center group-hover:scale-105 transition-transform">
                <lucide-icon [name]="mod.icono" class="w-5 h-5"></lucide-icon>
              </div>
              <span [ngClass]="mod.badgeClass" class="text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">{{ mod.categoria }}</span>
            </div>
            <h3 class="text-base font-bold text-[#2A2F63] group-hover:text-[#3E6D9C] transition-colors mb-1">
              {{ mod.titulo }}
            </h3>
            <p class="text-xs text-slate-500 mb-3 line-clamp-2">
              {{ mod.descripcion }}
            </p>
          </div>
          <div class="flex items-center text-xs font-semibold text-[#3E6D9C] gap-1 group-hover:gap-2 transition-all">
            <span>Abrir módulo</span>
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </div>
        </a>
      </div>

      <div *ngIf="modulos.length === 0" class="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200/80 text-center text-slate-500 shadow-sm">
        <lucide-icon name="shield" class="w-10 h-10 text-[#3E6D9C] mx-auto mb-3"></lucide-icon>
        <h3 class="text-base font-bold text-[#2A2F63] mb-1">
          {{ usuario ? 'El rol seleccionado no tiene módulos asignados' : 'Sesión no iniciada' }}
        </h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          {{ usuario ? 'Cambie de rol en el selector superior o solicite al administrador la asignación de menús y procesos.' : 'Conéctese desde el botón superior derecho o desde el panel lateral para acceder a sus módulos.' }}
        </p>
      </div>
    </div>
  `
})
export class InicioComponent implements OnInit {
  private auth = inject(Auth);
  private menuService = inject(MenuService);

  usuario: any = null;
  rolActivo: Rol | null = null;
  modulos: ModuloCard[] = [];

  private todosLosModulos: ModuloCard[] = [
    { categoria: 'Administración', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200', titulo: 'Gestión de Usuarios', descripcion: 'Registro de personal, teléfonos, fotos y cuentas de acceso.', ruta: '/gestion-usuarios', icono: 'users' },
    { categoria: 'Catálogo', badgeClass: 'bg-[#E3F6F5] text-[#2A2F63] border border-[#A7E0DB]', titulo: 'Gestión de Áreas', descripcion: 'Clasificación temática del material bibliográfico.', ruta: '/gestion-areas', icono: 'folder' },
    { categoria: 'Catálogo', badgeClass: 'bg-[#E3F6F5] text-[#2A2F63] border border-[#A7E0DB]', titulo: 'Gestión de Editoriales', descripcion: 'Administración de sellos editoriales y estado.', ruta: '/gestion-editoriales', icono: 'building' },
    { categoria: 'Catálogo', badgeClass: 'bg-[#E3F6F5] text-[#2A2F63] border border-[#A7E0DB]', titulo: 'Gestión de Tipos', descripcion: 'Formatos bibliográficos físicos y digitales.', ruta: '/gestion-tipos', icono: 'layers' },
    { categoria: 'Catálogo', badgeClass: 'bg-[#E3F6F5] text-[#2A2F63] border border-[#A7E0DB]', titulo: 'Gestión de Autores', descripcion: 'Catálogo de autores y ficha de impresión.', ruta: '/gestion-autores', icono: 'book' },
    { categoria: 'Catálogo', badgeClass: 'bg-[#E3F6F5] text-[#2A2F63] border border-[#A7E0DB]', titulo: 'Gestión de Textos', descripcion: 'Obras bibliográficas, autores múltiples y carga digital PDF.', ruta: '/gestion-textos', icono: 'file-text' },
    { categoria: 'Inventario', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200', titulo: 'Gestión de Ejemplares', descripcion: 'Inventario por código de inventario y disponibilidad.', ruta: '/gestion-ejemplares', icono: 'archive' },
    { categoria: 'Circulación', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200', titulo: 'Préstamos de Ejemplares', descripcion: 'Registro, anulación e impresión de préstamos bibliotecarios.', ruta: '/gestion-prestamos', icono: 'calendar' },
    { categoria: 'Circulación', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200', titulo: 'Devoluciones y Anulación', descripcion: 'Recepción de ejemplares prestados y reversión de devoluciones.', ruta: '/gestion-devoluciones', icono: 'rotate-ccw' },
    { categoria: 'Seguridad', badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200', titulo: 'Gestión de Roles', descripcion: 'Perfiles de acceso y seguridad del sistema.', ruta: '/gestion-roles', icono: 'shield' },
    { categoria: 'Seguridad', badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200', titulo: 'Gestión de Menús', descripcion: 'Grupos de navegación principal del sistema.', ruta: '/gestion-menus', icono: 'menu' },
    { categoria: 'Seguridad', badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200', titulo: 'Asignar Procesos a Menús', descripcion: 'Vinculación interactiva de procesos a menús.', ruta: '/asignar-mepro', icono: 'sliders' },
    { categoria: 'Seguridad', badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200', titulo: 'Asignar Menús a Roles', descripcion: 'Vinculación interactiva de menús a roles.', ruta: '/asignar-rolme', icono: 'shield-check' },
    { categoria: 'Seguridad', badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200', titulo: 'Asignar Roles a Usuarios', descripcion: 'Asignación de roles a usuarios con acceso.', ruta: '/asignar-rolusu', icono: 'user-check' }
  ];

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => {
      this.usuario = u;
      this.actualizarModulosPermitidos();
    });

    this.menuService.activeRol$.subscribe(rol => {
      this.rolActivo = rol;
    });

    this.menuService.activeMenus$.subscribe(() => {
      this.actualizarModulosPermitidos();
    });
  }

  puedeAcceder(ruta: string): boolean {
    return !!this.usuario && this.menuService.isRutaPermitida(ruta);
  }

  private actualizarModulosPermitidos() {
    if (!this.usuario) {
      this.modulos = [];
      return;
    }
    this.modulos = this.todosLosModulos.filter(mod => this.menuService.isRutaPermitida(mod.ruta));
  }
}
