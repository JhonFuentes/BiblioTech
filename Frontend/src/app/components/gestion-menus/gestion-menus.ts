import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService, Menu } from '../../services/menu.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-menus',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-menus.html',
  styleUrls: ['./gestion-menus.css']
})
export class GestionMenus implements OnInit {
  private menuService = inject(MenuService);

  menus: Menu[] = [];
  menusFiltrados: Menu[] = [];
  filtroNombre = '';
  filtroEstado = 'Todos';
  paginaActual = 1;
  itemsPorPagina = 10;
  menuAccionesAbierto: number | null = null;

  showFormModal = false;
  editMode = false;
  currentMenu: { codm?: number; nombre: string; estado?: number } = { nombre: '' };

  showConfirmDialog = false;
  dialogTipo: 'confirm' | 'aviso' | 'error' | 'success' = 'confirm';
  dialogSoloAceptar = false;
  confirmMensaje = '';
  confirmAccion: () => void = () => {};

  @HostListener('document:click')
  onClickOutside() {
    this.menuAccionesAbierto = null;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.ajustarItemsPorPagina();
  }

  ajustarItemsPorPagina() {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      this.itemsPorPagina = width < 640 ? 5 : 10;
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = Math.max(1, this.totalPaginas);
      }
    }
  }

  ngOnInit() {
    this.ajustarItemsPorPagina();
    this.cargarMenus();
  }

  cargarMenus() {
    this.menuService.listarCrud().subscribe({
      next: (data) => {
        this.menus = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar menús', err)
    });
  }

  aplicarFiltros() {
    let temp = this.menus;
    if (this.filtroNombre && this.filtroNombre.trim()) {
      const q = this.filtroNombre.toLowerCase().trim();
      temp = temp.filter(m => m.nombre.toLowerCase().includes(q));
    }
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(m => m.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(m => m.estado === 0);
    }
    this.menusFiltrados = temp;
    this.paginaActual = 1;
  }

  get menusPaginados(): Menu[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.menusFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.menusFiltrados.length / this.itemsPorPagina));
  }

  toggleMenuAcciones(m: Menu, event: Event) {
    event.stopPropagation();
    this.menuAccionesAbierto = this.menuAccionesAbierto === m.codm ? null : m.codm;
  }

  abrirAdicionar() {
    this.editMode = false;
    this.currentMenu = { nombre: '' };
    this.showFormModal = true;
  }

  abrirModificar(m: Menu) {
    this.editMode = true;
    this.currentMenu = { codm: m.codm, nombre: m.nombre, estado: m.estado };
    this.showFormModal = true;
  }

  solicitarGuardar() {
    if (!this.currentMenu.nombre || !this.currentMenu.nombre.trim()) {
      this.mostrarAviso('Por favor ingrese el nombre del menú');
      return;
    }

    const nombreNorm = this.currentMenu.nombre.trim().toLowerCase();
    const duplicado = this.menus.find(m =>
      m.nombre.trim().toLowerCase() === nombreNorm &&
      (!this.editMode || m.codm !== this.currentMenu.codm)
    );

    if (duplicado) {
      if (duplicado.estado === 1) {
        this.mostrarAviso(`Ya existe un menú activo con el nombre "${this.currentMenu.nombre.trim()}"`);
      } else {
        this.mostrarAviso(`Ya existe un menú con el nombre "${this.currentMenu.nombre.trim()}", pero se encuentra dado de baja.`);
      }
      return;
    }

    const mensaje = this.editMode
      ? '¿Seguro de Modificar Datos del Menú?'
      : '¿Seguro de Adicionar Datos del Menú?';

    this.confirmar(mensaje, () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    if (this.editMode && this.currentMenu.codm) {
      this.menuService.modificarMenu(this.currentMenu.codm, { nombre: this.currentMenu.nombre, estado: this.currentMenu.estado }).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarMenus();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al modificar menú')
      });
    } else {
      this.menuService.crearMenu({ nombre: this.currentMenu.nombre }).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarMenus();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al guardar menú')
      });
    }
  }

  eliminar(m: Menu) {
    this.confirmar('¿Seguro de Eliminar el Menú?', () => {
      this.showConfirmDialog = false;
      this.menuService.eliminarMenu(m.codm).subscribe({
        next: () => this.cargarMenus(),
        error: (err) => this.mostrarError(err?.error?.message || 'Error al dar de baja el menú')
      });
    });
  }

  habilitar(m: Menu) {
    this.confirmar('¿Seguro de Habilitar el Menú?', () => {
      this.showConfirmDialog = false;
      this.menuService.activarMenu(m.codm).subscribe({
        next: () => this.cargarMenus(),
        error: (err) => this.mostrarError(err?.error?.message || 'Error al habilitar el menú')
      });
    });
  }

  mostrarAviso(mensaje: string) {
    this.dialogTipo = 'aviso';
    this.dialogSoloAceptar = true;
    this.confirmMensaje = mensaje;
    this.confirmAccion = () => { this.showConfirmDialog = false; };
    this.showConfirmDialog = true;
  }

  mostrarError(mensaje: string) {
    this.dialogTipo = 'error';
    this.dialogSoloAceptar = true;
    this.confirmMensaje = mensaje;
    this.confirmAccion = () => { this.showConfirmDialog = false; };
    this.showConfirmDialog = true;
  }

  confirmar(mensaje: string, accion: () => void) {
    this.dialogTipo = 'confirm';
    this.dialogSoloAceptar = false;
    this.confirmMensaje = mensaje;
    this.confirmAccion = accion;
    this.showConfirmDialog = true;
  }

  onConfirmDialog() {
    this.confirmAccion();
  }

  onCancelDialog() {
    this.showConfirmDialog = false;
  }

  cerrarModal() {
    this.showFormModal = false;
  }
}
