import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

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
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Bienvenido, {{ usuario?.user || 'Invitado' }}
          </h1>
          <p class="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            Plataforma integral de gestión bibliotecaria: administración de usuarios y roles (RBAC), catálogo bibliográfico, inventario de ejemplares físicos y digitales, préstamos y devoluciones.
          </p>
          <div class="flex flex-wrap gap-3">
            <a routerLink="/catalogo-digital" 
              class="bg-white text-[#2A2F63] hover:bg-[#E3F6F5] font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2">
              <lucide-icon name="book-open" class="w-4 h-4 text-[#3E6D9C]"></lucide-icon> Búsqueda Digital (B-20)
            </a>
            <a routerLink="/gestion-prestamos" 
              class="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition border border-white/20 flex items-center gap-2">
              <lucide-icon name="calendar" class="w-4 h-4"></lucide-icon> Préstamos de Ejemplares (B-12)
            </a>
            <a routerLink="/gestion-textos" 
              class="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition border border-white/20 flex items-center gap-2">
              <lucide-icon name="file-text" class="w-4 h-4"></lucide-icon> Gestión de Textos (B-10)
            </a>
          </div>
        </div>
      </div>

      <!-- Módulos del Sistema (B-4 a B-20.1) -->
      <div class="mb-4">
        <h2 class="text-xl font-bold text-[#2A2F63] m-0">Módulos del Sistema Web (B-1 a B-20.1)</h2>
        <p class="text-xs text-slate-500 m-0 mt-1">Acceso directo a todos los procesos de administración, catálogo, circulación y seguridad</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <a *ngFor="let mod of modulos" [routerLink]="mod.ruta"
          class="group bg-white/80 hover:bg-white backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#E3F6F5] text-[#3E6D9C] flex items-center justify-center group-hover:scale-105 transition-transform">
                <lucide-icon [name]="mod.icono" class="w-5 h-5"></lucide-icon>
              </div>
              <span class="text-[11px] font-bold text-[#2A2F63] bg-[#A7E0DB]/50 px-2.5 py-0.5 rounded-full uppercase">{{ mod.codigo }}</span>
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
    </div>
  `
})
export class InicioComponent implements OnInit {
  private auth = inject(Auth);
  usuario: any = null;

  modulos = [
    { codigo: 'B-4', titulo: 'Gestión de Usuarios', descripcion: 'Registro de personal, teléfonos, fotos y cuentas de acceso.', ruta: '/gestion-usuarios', icono: 'users' },
    { codigo: 'B-6', titulo: 'Gestión de Áreas', descripcion: 'Clasificación temática del material bibliográfico.', ruta: '/gestion-areas', icono: 'folder' },
    { codigo: 'B-7', titulo: 'Gestión de Editoriales', descripcion: 'Administración de sellos editoriales y estado.', ruta: '/gestion-editoriales', icono: 'building' },
    { codigo: 'B-8', titulo: 'Gestión de Tipos', descripcion: 'Formatos bibliográficos físicos y digitales (SW).', ruta: '/gestion-tipos', icono: 'layers' },
    { codigo: 'B-9', titulo: 'Gestión de Autores', descripcion: 'Catálogo de autores y ficha de impresión.', ruta: '/gestion-autores', icono: 'book' },
    { codigo: 'B-10', titulo: 'Gestión de Textos', descripcion: 'Obras bibliográficas, autores múltiples y carga digital PDF.', ruta: '/gestion-textos', icono: 'file-text' },
    { codigo: 'B-11', titulo: 'Gestión de Ejemplares', descripcion: 'Inventario por código de inventario y disponibilidad.', ruta: '/gestion-ejemplares', icono: 'archive' },
    { codigo: 'B-12', titulo: 'Préstamos de Ejemplares', descripcion: 'Registro, anulación e impresión de préstamos bibliotecarios.', ruta: '/gestion-prestamos', icono: 'calendar' },
    { codigo: 'B-13/14', titulo: 'Devoluciones y Anulación', descripcion: 'Recepción de ejemplares prestados y reversión de devoluciones.', ruta: '/gestion-devoluciones', icono: 'rotate-ccw' },
    { codigo: 'B-15', titulo: 'Gestión de Roles', descripcion: 'Perfiles de acceso y seguridad del sistema.', ruta: '/gestion-roles', icono: 'shield' },
    { codigo: 'B-16', titulo: 'Gestión de Menús', descripcion: 'Grupos de navegación principal del sistema.', ruta: '/gestion-menus', icono: 'menu' },
    { codigo: 'B-17', titulo: 'Asignar Procesos (MEPRO)', descripcion: 'Vinculación interactiva de procesos a menús.', ruta: '/asignar-mepro', icono: 'sliders' },
    { codigo: 'B-18', titulo: 'Asignar Menús (ROLME)', descripcion: 'Vinculación interactiva de menús a roles.', ruta: '/asignar-rolme', icono: 'shield-check' },
    { codigo: 'B-19', titulo: 'Asignar Roles (ROLUSU)', descripcion: 'Asignación de roles a usuarios con acceso.', ruta: '/asignar-rolusu', icono: 'user-check' },
    { codigo: 'B-20', titulo: 'Catálogo Digital', descripcion: 'Búsqueda pública y visor embebido de documentos digitales.', ruta: '/catalogo-digital', icono: 'book-open' }
  ];

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => this.usuario = u);
  }
}
