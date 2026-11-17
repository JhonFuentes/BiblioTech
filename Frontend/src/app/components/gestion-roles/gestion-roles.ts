import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolService, Rol } from '../../services/rol.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-roles.html',
  styleUrls: ['./gestion-roles.css']
})
export class GestionRoles implements OnInit {
  private rolService = inject(RolService);

  roles: Rol[] = [];
  rolesFiltrados: Rol[] = [];
  filtroNombre = '';
  filtroEstado = 'Todos';
  paginaActual = 1;
  itemsPorPagina = 15;
  menuAccionesAbierto: number | string | null = null;

  showFormModal = false;
  editMode = false;
  currentRol: Rol = { nombre: '' };

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
      if (width < 640) this.itemsPorPagina = 5;
      else if (width < 1024) this.itemsPorPagina = 10;
      else this.itemsPorPagina = 15;
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = Math.max(1, this.totalPaginas);
      }
    }
  }

  ngOnInit() {
    this.ajustarItemsPorPagina();
    this.cargarRoles();
  }

  cargarRoles() {
    this.rolService.listar().subscribe({
      next: (data) => {
        this.roles = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  aplicarFiltros() {
    let temp = this.roles;
    if (this.filtroNombre && this.filtroNombre.trim()) {
      const q = this.filtroNombre.toLowerCase().trim();
      temp = temp.filter(r => r.nombre.toLowerCase().includes(q));
    }
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(r => r.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(r => r.estado === 0);
    }
    this.rolesFiltrados = temp;
    this.paginaActual = 1;
  }

  get rolesPaginados(): Rol[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.rolesFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.rolesFiltrados.length / this.itemsPorPagina));
  }

  toggleMenuAcciones(r: Rol, event: Event) {
    event.stopPropagation();
    this.menuAccionesAbierto = this.menuAccionesAbierto === r.codr ? null : r.codr || null;
  }

  abrirAdicionar() {
    this.editMode = false;
    this.currentRol = { nombre: '' };
    this.showFormModal = true;
  }

  abrirModificar(r: Rol) {
    this.editMode = true;
    this.currentRol = { ...r };
    this.showFormModal = true;
  }

  solicitarGuardar() {
    if (!this.currentRol.nombre || !this.currentRol.nombre.trim()) {
      this.mostrarAviso('Por favor ingrese el nombre del rol');
      return;
    }

    const nombreNorm = this.currentRol.nombre.trim().toLowerCase();
    const duplicado = this.roles.find(r => 
      r.nombre.trim().toLowerCase() === nombreNorm &&
      (!this.editMode || r.codr !== this.currentRol.codr)
    );

    if (duplicado) {
      if (duplicado.estado === 1) {
        this.mostrarAviso(`Ya existe un rol activo con el nombre "${this.currentRol.nombre.trim()}"`);
      } else {
        this.mostrarAviso(`Ya existe un rol con el nombre "${this.currentRol.nombre.trim()}", pero se encuentra dado de baja.`);
      }
      return;
    }

    const mensaje = this.editMode 
      ? '¿Seguro de Modificar los Datos del Rol?' 
      : '¿Seguro de Adicionar el Nuevo Rol?';

    this.confirmar(mensaje, () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    if (this.editMode && this.currentRol.codr) {
      this.rolService.modificar(this.currentRol.codr, this.currentRol).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarRoles();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al modificar rol')
      });
    } else {
      this.rolService.crear(this.currentRol).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarRoles();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al guardar rol')
      });
    }
  }

  eliminar(r: Rol) {
    this.confirmar('¿Seguro de Eliminar el Rol?', () => {
      this.showConfirmDialog = false;
      if (r.codr) {
        this.rolService.eliminar(r.codr).subscribe({
          next: () => this.cargarRoles(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al dar de baja el rol')
        });
      }
    });
  }

  habilitar(r: Rol) {
    this.confirmar('¿Seguro de Habilitar el Rol?', () => {
      this.showConfirmDialog = false;
      if (r.codr) {
        this.rolService.habilitar(r.codr).subscribe({
          next: () => this.cargarRoles(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al habilitar el rol')
        });
      }
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
