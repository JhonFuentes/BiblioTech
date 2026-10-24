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
            Plataforma centralizada para el inventario, control de usuarios, áreas temáticas, editoriales, formatos bibliográficos y catálogo de autores.
          </p>
          <div class="flex flex-wrap gap-3">
            <a routerLink="/gestion-usuarios" 
              class="bg-white text-[#2A2F63] hover:bg-[#E3F6F5] font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2">
              <lucide-icon name="users" class="w-4 h-4 text-[#3E6D9C]"></lucide-icon> Gestión Usuarios
            </a>
            <a routerLink="/gestion-areas" 
              class="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition border border-white/20 flex items-center gap-2">
              <lucide-icon name="folder" class="w-4 h-4"></lucide-icon> Catálogo Bibliográfico
            </a>
          </div>
        </div>
      </div>

      <!-- Módulos de la Presentación 4 -->
      <div class="mb-4">
        <h2 class="text-xl font-bold text-[#2A2F63] m-0">Módulos del Sistema</h2>
        <p class="text-xs text-slate-500 m-0 mt-1">Acceso directo a las interfaces de administración y catálogo</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- B-4 Gestión Usuarios -->
        <a routerLink="/gestion-usuarios" 
          class="group bg-white/80 hover:bg-white backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 block">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <lucide-icon name="users" class="w-6 h-6"></lucide-icon>
            </div>
            <span class="text-xs font-bold text-purple-600 bg-purple-100/70 px-2.5 py-1 rounded-full uppercase">B-4</span>
          </div>
          <h3 class="text-lg font-bold text-[#2A2F63] group-hover:text-[#3E6D9C] transition-colors mb-1">
            Gestión de Usuarios
          </h3>
          <p class="text-xs text-slate-500 mb-4 line-clamp-2">
            Administración de personal (administrativos y público), teléfonos, credenciales y estados.
          </p>
          <div class="flex items-center text-xs font-semibold text-[#3E6D9C] gap-1 group-hover:gap-2 transition-all">
            <span>Ingresar al módulo</span>
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </div>
        </a>

        <!-- B-6 Gestión Áreas -->
        <a routerLink="/gestion-areas" 
          class="group bg-white/80 hover:bg-white backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 block">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <lucide-icon name="folder" class="w-6 h-6"></lucide-icon>
            </div>
            <span class="text-xs font-bold text-cyan-600 bg-cyan-100/70 px-2.5 py-1 rounded-full uppercase">B-6</span>
          </div>
          <h3 class="text-lg font-bold text-[#2A2F63] group-hover:text-[#3E6D9C] transition-colors mb-1">
            Gestión de Áreas
          </h3>
          <p class="text-xs text-slate-500 mb-4 line-clamp-2">
            Clasificación temática del material bibliográfico, filtrado y altas/bajas lógicas.
          </p>
          <div class="flex items-center text-xs font-semibold text-[#3E6D9C] gap-1 group-hover:gap-2 transition-all">
            <span>Ingresar al módulo</span>
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </div>
        </a>

        <!-- B-7 Gestión Editoriales -->
        <a routerLink="/gestion-editoriales" 
          class="group bg-white/80 hover:bg-white backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 block">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <lucide-icon name="building" class="w-6 h-6"></lucide-icon>
            </div>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-100/70 px-2.5 py-1 rounded-full uppercase">B-7</span>
          </div>
          <h3 class="text-lg font-bold text-[#2A2F63] group-hover:text-[#3E6D9C] transition-colors mb-1">
            Gestión de Editoriales
          </h3>
          <p class="text-xs text-slate-500 mb-4 line-clamp-2">
            Registro de editoriales y sellos de publicación, control de estados y paginación.
          </p>
          <div class="flex items-center text-xs font-semibold text-[#3E6D9C] gap-1 group-hover:gap-2 transition-all">
            <span>Ingresar al módulo</span>
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </div>
        </a>

        <!-- B-8 Gestión Tipos -->
        <a routerLink="/gestion-tipos" 
          class="group bg-white/80 hover:bg-white backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 block">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <lucide-icon name="layers" class="w-6 h-6"></lucide-icon>
            </div>
            <span class="text-xs font-bold text-amber-600 bg-amber-100/70 px-2.5 py-1 rounded-full uppercase">B-8</span>
          </div>
          <h3 class="text-lg font-bold text-[#2A2F63] group-hover:text-[#3E6D9C] transition-colors mb-1">
            Gestión de Tipos
          </h3>
          <p class="text-xs text-slate-500 mb-4 line-clamp-2">
            Tipos de texto físicos y digitales, control del flag digital (SW: Con Documento).
          </p>
          <div class="flex items-center text-xs font-semibold text-[#3E6D9C] gap-1 group-hover:gap-2 transition-all">
            <span>Ingresar al módulo</span>
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </div>
        </a>

        <!-- B-9 Gestión Autores -->
        <a routerLink="/gestion-autores" 
          class="group bg-white/80 hover:bg-white backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 block">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <lucide-icon name="book" class="w-6 h-6"></lucide-icon>
            </div>
            <span class="text-xs font-bold text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-full uppercase">B-9</span>
          </div>
          <h3 class="text-lg font-bold text-[#2A2F63] group-hover:text-[#3E6D9C] transition-colors mb-1">
            Gestión de Autores
          </h3>
          <p class="text-xs text-slate-500 mb-4 line-clamp-2">
            Registro de autores, nombres, apellidos, género, ficha de impresión y control de baja lógica.
          </p>
          <div class="flex items-center text-xs font-semibold text-[#3E6D9C] gap-1 group-hover:gap-2 transition-all">
            <span>Ingresar al módulo</span>
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </div>
        </a>

        <!-- B-5 Diálogos & B-3 Sesión -->
        <div class="bg-gradient-to-br from-slate-50 to-[#E3F6F5]/50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-xl bg-slate-200/60 text-[#3E6D9C] flex items-center justify-center mb-4">
              <lucide-icon name="shield-check" class="w-6 h-6"></lucide-icon>
            </div>
            <h3 class="text-lg font-bold text-[#2A2F63] mb-1">Seguridad & Confirmaciones</h3>
            <p class="text-xs text-slate-500">
              Validación general B-5 en altas, bajas y modificaciones. Autenticación con JWT (B-3.1) y actualización de fotos de perfil (B-3.2).
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Sistema conectado y validado</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InicioComponent implements OnInit {
  private auth = inject(Auth);
  usuario: any = null;

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => this.usuario = u);
  }
}
