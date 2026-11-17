import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EjemplarService, Ejemplar } from '../../services/ejemplar.service';
import { TextoService, Texto } from '../../services/texto.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-ejemplares',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-ejemplares.html',
  styleUrls: ['./gestion-ejemplares.css']
})
export class GestionEjemplares implements OnInit {
  private ejemplarService = inject(EjemplarService);
  private textoService = inject(TextoService);

  textos: Texto[] = [];
  selectedCodt: number | null = null;
  selectedTexto: Texto | null = null;

  ejemplares: Ejemplar[] = [];
  ejemplaresFiltrados: Ejemplar[] = [];
  filtroEstado = 'Activos'; // Activos, Bajas, Todos

  paginaActual = 1;
  itemsPorPagina = 10;
  menuAccionesAbierto: number | string | null = null;

  // Modales
  showFormModal = false;
  editMode = false;
  currentEjemplar: Ejemplar = { codt: 0, disponible: 1, estado: 1 };

  // Diálogo B-5
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
      else this.itemsPorPagina = 10;
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = Math.max(1, this.totalPaginas);
      }
    }
  }

  ngOnInit() {
    this.ajustarItemsPorPagina();
    this.cargarTextos();
  }

  cargarTextos() {
    this.textoService.listar().subscribe({
      next: (data) => {
        this.textos = data.filter(t => t.estado === 1);
        if (this.textos.length > 0 && !this.selectedCodt) {
          this.seleccionarTexto(this.textos[0]);
        }
      },
      error: (err) => console.error('Error al cargar textos', err)
    });
  }

  seleccionarTexto(t: Texto) {
    this.selectedCodt = t.codt || null;
    this.selectedTexto = t;
    this.cargarEjemplares();
  }

  cargarEjemplares() {
    if (!this.selectedCodt) {
      this.ejemplares = [];
      this.ejemplaresFiltrados = [];
      return;
    }
    this.ejemplarService.listar(this.selectedCodt).subscribe({
      next: (data) => {
        this.ejemplares = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar ejemplares', err)
    });
  }

  aplicarFiltros() {
    let temp = this.ejemplares;
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(e => e.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(e => e.estado === 0);
    }
    this.ejemplaresFiltrados = temp;
    this.paginaActual = 1;
  }

  get ejemplaresPaginados(): Ejemplar[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.ejemplaresFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.ejemplaresFiltrados.length / this.itemsPorPagina));
  }

  toggleMenuAcciones(e: Ejemplar, event: Event) {
    event.stopPropagation();
    this.menuAccionesAbierto = this.menuAccionesAbierto === e.codinv ? null : e.codinv || null;
  }

  abrirAdicionar() {
    if (!this.selectedCodt) {
      this.mostrarAviso('Por favor seleccione un texto primero');
      return;
    }
    this.editMode = false;
    this.currentEjemplar = {
      codt: this.selectedCodt,
      disponible: 1,
      estado: 1
    };
    this.showFormModal = true;
  }

  abrirModificar(e: Ejemplar) {
    this.editMode = true;
    this.currentEjemplar = { ...e };
    this.showFormModal = true;
  }

  solicitarGuardar() {
    const mensaje = this.editMode 
      ? '¿Seguro de Modificar los Datos del Ejemplar?' 
      : '¿Seguro de Adicionar el Nuevo Ejemplar?';

    this.confirmar(mensaje, () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    if (this.editMode && this.currentEjemplar.codinv) {
      this.ejemplarService.modificar(this.currentEjemplar.codinv, this.currentEjemplar).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarEjemplares();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al modificar ejemplar')
      });
    } else {
      this.ejemplarService.crear(this.currentEjemplar).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarEjemplares();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al crear ejemplar')
      });
    }
  }

  eliminar(e: Ejemplar) {
    this.confirmar('¿Seguro de Eliminar el Ejemplar?', () => {
      this.showConfirmDialog = false;
      if (e.codinv) {
        this.ejemplarService.eliminar(e.codinv).subscribe({
          next: () => this.cargarEjemplares(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al dar de baja el ejemplar')
        });
      }
    });
  }

  habilitar(e: Ejemplar) {
    this.confirmar('¿Seguro de Habilitar el Ejemplar?', () => {
      this.showConfirmDialog = false;
      if (e.codinv) {
        this.ejemplarService.habilitar(e.codinv).subscribe({
          next: () => this.cargarEjemplares(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al habilitar el ejemplar')
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
