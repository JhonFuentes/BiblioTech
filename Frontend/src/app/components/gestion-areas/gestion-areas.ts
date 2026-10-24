import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AreaService, Area } from '../../services/area.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-areas',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-areas.html',
  styleUrls: ['./gestion-areas.css']
})
export class GestionAreas implements OnInit {
  private areaService = inject(AreaService);

  areas: Area[] = [];
  areasFiltradas: Area[] = [];
  filtroNombre = '';
  filtroEstado = 'Todos'; // Activos, Bajas, Todos
  paginaActual = 1;
  itemsPorPagina = 15;

  menuAccionesAbierto: number | string | null = null;

  @HostListener('document:click')
  onClickOutside() {
    this.menuAccionesAbierto = null;
  }

  toggleMenuAcciones(a: Area, event: Event) {
    event.stopPropagation();
    if (this.menuAccionesAbierto === a.coda) {
      this.menuAccionesAbierto = null;
    } else {
      this.menuAccionesAbierto = a.coda || null;
    }
  }

  cerrarMenuAcciones() {
    this.menuAccionesAbierto = null;
  }

  // Modals state
  showFormModal = false;
  editMode = false;
  currentArea: Area = { nombre: '' };

  // Confirmation dialog (B-5)
  showConfirmDialog = false;
  dialogTipo: 'confirm' | 'aviso' | 'error' | 'success' = 'confirm';
  dialogSoloAceptar = false;
  confirmMensaje = '';
  confirmAccion: () => void = () => {};

  @HostListener('window:resize')
  onWindowResize() {
    this.ajustarItemsPorPagina();
  }

  ajustarItemsPorPagina() {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) {
        this.itemsPorPagina = 5; // Móvil: 5 filas
      } else if (width < 1024) {
        this.itemsPorPagina = 10; // Tablet: 10 filas
      } else {
        this.itemsPorPagina = 15; // Escritorio: 15 filas
      }
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = Math.max(1, this.totalPaginas);
      }
    }
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

  ngOnInit() {
    this.ajustarItemsPorPagina();
    this.cargarAreas();
  }

  cargarAreas() {
    this.areaService.listar().subscribe({
      next: (data) => {
        this.areas = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar áreas', err)
    });
  }

  aplicarFiltros() {
    let temp = this.areas;
    if (this.filtroNombre && this.filtroNombre.trim()) {
      const q = this.filtroNombre.toLowerCase().trim();
      temp = temp.filter(a => a.nombre.toLowerCase().includes(q));
    }
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(a => a.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(a => a.estado === 0);
    }
    this.areasFiltradas = temp;
    this.paginaActual = 1;
  }

  get areasPaginadas(): Area[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.areasFiltradas.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.areasFiltradas.length / this.itemsPorPagina));
  }

  // B-6.1 Adicionar
  abrirAdicionar() {
    this.editMode = false;
    this.currentArea = { nombre: '' };
    this.showFormModal = true;
  }

  // B-6.2 Modificar
  abrirModificar(a: Area) {
    this.editMode = true;
    this.currentArea = { ...a };
    this.showFormModal = true;
  }

  solicitarGuardar() {
    if (!this.currentArea.nombre || !this.currentArea.nombre.trim()) {
      this.mostrarAviso('Por favor ingrese el nombre del área');
      return;
    }

    const mensaje = this.editMode 
      ? '¿Seguro de Modificar los Datos del Área?' 
      : '¿Seguro de Adicionar la Nueva Área?';

    this.confirmar(mensaje, () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    if (this.editMode && this.currentArea.coda) {
      this.areaService.modificar(this.currentArea.coda, this.currentArea).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarAreas();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al modificar área')
      });
    } else {
      this.areaService.crear(this.currentArea).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarAreas();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al guardar área')
      });
    }
  }

  // Eliminar (Baja)
  eliminar(a: Area) {
    this.confirmar('¿Seguro de Eliminar el Área?', () => {
      this.showConfirmDialog = false;
      if (a.coda) {
        this.areaService.eliminar(a.coda).subscribe({
          next: () => this.cargarAreas(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al dar de baja área')
        });
      }
    });
  }

  // Habilitar
  habilitar(a: Area) {
    this.confirmar('¿Seguro de Habilitar el Área?', () => {
      this.showConfirmDialog = false;
      if (a.coda) {
        this.areaService.habilitar(a.coda).subscribe({
          next: () => this.cargarAreas(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al habilitar área')
        });
      }
    });
  }

  cerrarModal() {
    this.showFormModal = false;
  }

  onConfirmDialog() {
    this.confirmAccion();
  }

  onCancelDialog() {
    this.showConfirmDialog = false;
  }
}
