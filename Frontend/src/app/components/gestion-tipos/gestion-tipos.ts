import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoService, Tipo } from '../../services/tipo.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-tipos',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-tipos.html',
  styleUrls: ['./gestion-tipos.css']
})
export class GestionTipos implements OnInit {
  private tipoService = inject(TipoService);

  tipos: Tipo[] = [];
  tiposFiltrados: Tipo[] = [];
  filtroNombre = '';
  filtroEstado = 'Todos'; // Activos, Bajas, Todos
  paginaActual = 1;
  itemsPorPagina = 15;

  menuAccionesAbierto: number | string | null = null;

  @HostListener('document:click')
  onClickOutside() {
    this.menuAccionesAbierto = null;
  }

  toggleMenuAcciones(t: Tipo, event: Event) {
    event.stopPropagation();
    if (this.menuAccionesAbierto === t.codtipo) {
      this.menuAccionesAbierto = null;
    } else {
      this.menuAccionesAbierto = t.codtipo || null;
    }
  }

  cerrarMenuAcciones() {
    this.menuAccionesAbierto = null;
  }

  // Modals state
  showFormModal = false;
  editMode = false;
  currentTipo: Tipo = { nombre: '', sw: 0 };
  conDocumentoCheckbox = false;

  // Confirm dialog (B-5)
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
    this.cargarTipos();
  }

  cargarTipos() {
    this.tipoService.listar().subscribe({
      next: (data) => {
        this.tipos = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar tipos', err)
    });
  }

  aplicarFiltros() {
    let temp = this.tipos;
    if (this.filtroNombre && this.filtroNombre.trim()) {
      const q = this.filtroNombre.toLowerCase().trim();
      temp = temp.filter(t => t.nombre.toLowerCase().includes(q));
    }
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(t => t.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(t => t.estado === 0);
    }
    this.tiposFiltrados = temp;
    this.paginaActual = 1;
  }

  get tiposPaginados(): Tipo[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.tiposFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.tiposFiltrados.length / this.itemsPorPagina));
  }

  // B-8.1 Adicionar
  abrirAdicionar() {
    this.editMode = false;
    this.currentTipo = { nombre: '', sw: 0 };
    this.conDocumentoCheckbox = false;
    this.showFormModal = true;
  }

  // B-8.2 Modificar
  abrirModificar(t: Tipo) {
    this.editMode = true;
    this.currentTipo = { ...t };
    this.conDocumentoCheckbox = t.sw === 1;
    this.showFormModal = true;
  }

  solicitarGuardar() {
    if (!this.currentTipo.nombre || !this.currentTipo.nombre.trim()) {
      this.mostrarAviso('Por favor ingrese el nombre del tipo');
      return;
    }

    this.currentTipo.sw = this.conDocumentoCheckbox ? 1 : 0;

    const mensaje = this.editMode 
      ? '¿Seguro de Modificar los Datos del Tipo?' 
      : '¿Seguro de Adicionar el Nuevo Tipo?';

    this.confirmar(mensaje, () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    this.currentTipo.sw = this.conDocumentoCheckbox ? 1 : 0;

    if (this.editMode && this.currentTipo.codtipo) {
      this.tipoService.modificar(this.currentTipo.codtipo, this.currentTipo).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarTipos();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al modificar tipo')
      });
    } else {
      this.tipoService.crear(this.currentTipo).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarTipos();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al guardar tipo')
      });
    }
  }

  // B-8 Eliminar (Baja lógica)
  eliminar(t: Tipo) {
    this.confirmar('¿Seguro de Eliminar el Tipo?', () => {
      this.showConfirmDialog = false;
      if (t.codtipo) {
        this.tipoService.eliminar(t.codtipo).subscribe({
          next: () => this.cargarTipos(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al dar de baja tipo')
        });
      }
    });
  }

  // B-8 Habilitar
  habilitar(t: Tipo) {
    this.confirmar('¿Seguro de Habilitar el Tipo?', () => {
      this.showConfirmDialog = false;
      if (t.codtipo) {
        this.tipoService.habilitar(t.codtipo).subscribe({
          next: () => this.cargarTipos(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al habilitar tipo')
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
