import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DevolucionService, Devolucion } from '../../services/devolucion.service';
import { Prestamo } from '../../services/prestamo.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-devoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-devoluciones.html',
  styleUrls: ['./gestion-devoluciones.css']
})
export class GestionDevoluciones implements OnInit {
  private devolucionService = inject(DevolucionService);
  private route = inject(ActivatedRoute);

  activeTab: 'registrar' | 'historial' = 'registrar';

  // Tab 1: Registrar Devolución (B-13)
  prestamosPendientes: Prestamo[] = [];
  prestamosFiltrados: Prestamo[] = [];
  fechaInicioReg = '';
  fechaFinReg = '';
  filtroEstudianteReg = '';
  filtroCodinvReg: number | null = null;
  filtroEstadoDetalleReg: number = 1; // [4] 1 = Prestados, 0 = Devueltos
  prestamoSeleccionado: Prestamo | null = null;
  ejemplaresADevolver: { [codinv: number]: boolean } = {};

  // Tab 2: Historial y Anulación (B-14)
  devoluciones: Devolucion[] = [];
  devolucionesFiltradas: Devolucion[] = [];
  fechaInicioHist = '';
  fechaFinHist = '';
  filtroEstudianteHist = '';
  filtroEstadoHist = 'Activos'; // Activos, Bajas, Todos
  devolucionSeleccionada: Devolucion | null = null;

  paginaActualReg = 1;
  paginaActualHist = 1;
  itemsPorPagina = 10;
  menuAccionesAbierto: number | string | null = null;

  // Diálogo
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

  toggleMenuAcciones(d: Devolucion, event: Event) {
    event.stopPropagation();
    this.menuAccionesAbierto = this.menuAccionesAbierto === d.codd ? null : d.codd || null;
  }

  cerrarMenuAcciones() {
    this.menuAccionesAbierto = null;
  }

  ajustarItemsPorPagina() {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) this.itemsPorPagina = 5;
      else if (width < 1024) this.itemsPorPagina = 8;
      else this.itemsPorPagina = 10;
    }
  }

  ngOnInit() {
    this.ajustarItemsPorPagina();
    this.route.data.subscribe(data => {
      if (data && data['tab'] === 'historial') {
        this.activeTab = 'historial';
      } else {
        this.activeTab = 'registrar';
      }
    });
    this.cargarPrestamosPendientes();
    this.cargarHistorialDevoluciones();
  }

  setTab(tab: 'registrar' | 'historial') {
    this.activeTab = tab;
    if (tab === 'registrar') this.cargarPrestamosPendientes();
    else this.cargarHistorialDevoluciones();
  }

  // ==========================
  // B-13: Registrar Devolución
  // ==========================
  cargarPrestamosPendientes() {
    this.devolucionService.listarPrestamosPendientes(
      this.fechaInicioReg || undefined,
      this.fechaFinReg || undefined,
      undefined,
      undefined,
      this.filtroEstadoDetalleReg
    ).subscribe({
      next: (data) => {
        this.prestamosPendientes = data;
        this.aplicarFiltrosReg();
      },
      error: (err) => console.error('Error al cargar pendientes', err)
    });
  }

  cambiarEstadoDetalleReg() {
    this.prestamoSeleccionado = null;
    this.cargarPrestamosPendientes();
  }

  aplicarFiltrosReg() {
    let temp = this.prestamosPendientes;
    if (this.fechaInicioReg) {
      temp = temp.filter(p => p.fecha ? p.fecha >= this.fechaInicioReg : true);
    }
    if (this.fechaFinReg) {
      temp = temp.filter(p => p.fecha ? p.fecha <= this.fechaFinReg : true);
    }
    if (this.filtroEstudianteReg && this.filtroEstudianteReg.trim()) {
      const q = this.filtroEstudianteReg.toLowerCase().trim();
      temp = temp.filter(p => 
        (p.estudianteNombre && p.estudianteNombre.toLowerCase().includes(q)) ||
        (p.ci && p.ci.toString().includes(q))
      );
    }
    if (this.filtroCodinvReg) {
      const num = Number(this.filtroCodinvReg);
      temp = temp.filter(p => p.codp === num || p.detalles?.some(d => d.codinv === num));
    }
    this.prestamosFiltrados = temp;
    this.paginaActualReg = 1;
    if (this.prestamosFiltrados.length > 0) {
      if (!this.prestamoSeleccionado || !this.prestamosFiltrados.some(p => p.codp === this.prestamoSeleccionado?.codp)) {
        this.seleccionarPrestamo(this.prestamosFiltrados[0]);
      } else {
        this.seleccionarPrestamo(this.prestamosFiltrados.find(p => p.codp === this.prestamoSeleccionado?.codp) || this.prestamosFiltrados[0]);
      }
    } else {
      this.prestamoSeleccionado = null;
    }
  }

  seleccionarPrestamo(p: Prestamo) {
    this.prestamoSeleccionado = p;
    this.ejemplaresADevolver = {};
    if (p.detalles) {
      p.detalles.forEach(d => {
        if (d.estado === 1) {
          this.ejemplaresADevolver[d.codinv] = true; // Por defecto marcar los pendientes
        }
      });
    }
  }

  get pendientesPaginados(): Prestamo[] {
    const start = (this.paginaActualReg - 1) * this.itemsPorPagina;
    return this.prestamosFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginasReg(): number {
    return Math.max(1, Math.ceil(this.prestamosFiltrados.length / this.itemsPorPagina));
  }

  get paginasRegArray(): number[] {
    return Array.from({ length: this.totalPaginasReg }, (_, i) => i + 1);
  }

  solicitarGuardarDevolucion() {
    if (!this.prestamoSeleccionado || !this.prestamoSeleccionado.codp) {
      this.mostrarAviso('Por favor seleccione un préstamo');
      return;
    }

    const codinvs = Object.keys(this.ejemplaresADevolver)
      .map(k => Number(k))
      .filter(k => this.ejemplaresADevolver[k]);

    if (codinvs.length === 0) {
      this.mostrarAviso('Por favor marque al menos un ejemplar a devolver');
      return;
    }

    this.confirmar(`¿Seguro de Registrar la Devolución de ${codinvs.length} ejemplar(es)?`, () => {
      this.showConfirmDialog = false;
      const devolucion: Devolucion = {
        codp: this.prestamoSeleccionado!.codp!,
        ejemplaresIds: codinvs
      };
      this.devolucionService.registrarDevolucion(devolucion).subscribe({
        next: () => {
          this.mostrarAviso('Devolución registrada con éxito. Los ejemplares han sido liberados.');
          this.prestamoSeleccionado = null;
          this.cargarPrestamosPendientes();
          this.cargarHistorialDevoluciones();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al registrar la devolución')
      });
    });
  }

  // ============================================
  // B-14: Historial y Anulación de Devoluciones
  // ============================================
  cargarHistorialDevoluciones() {
    this.devolucionService.listarPaginado(0, 100).subscribe({
      next: (page) => {
        this.devoluciones = page.content || [];
        this.aplicarFiltrosHist();
      },
      error: (err) => console.error('Error al cargar historial', err)
    });
  }

  aplicarFiltrosHist() {
    let temp = this.devoluciones;
    if (this.fechaInicioHist) {
      temp = temp.filter(d => d.fecha ? d.fecha >= this.fechaInicioHist : true);
    }
    if (this.fechaFinHist) {
      temp = temp.filter(d => d.fecha ? d.fecha <= this.fechaFinHist : true);
    }
    if (this.filtroEstudianteHist && this.filtroEstudianteHist.trim()) {
      const q = this.filtroEstudianteHist.toLowerCase().trim();
      temp = temp.filter(d => 
        (d.estudianteNombre && d.estudianteNombre.toLowerCase().includes(q)) ||
        (d.ci && d.ci.toString().includes(q))
      );
    }
    if (this.filtroEstadoHist === 'Activos') {
      temp = temp.filter(d => d.estado === 1);
    } else if (this.filtroEstadoHist === 'Bajas') {
      temp = temp.filter(d => d.estado === 0);
    }
    this.devolucionesFiltradas = temp;
    this.paginaActualHist = 1;
    if (this.devolucionesFiltradas.length > 0) {
      if (!this.devolucionSeleccionada || !this.devolucionesFiltradas.some(d => d.codd === this.devolucionSeleccionada?.codd)) {
        this.devolucionSeleccionada = this.devolucionesFiltradas[0];
      } else {
        this.devolucionSeleccionada = this.devolucionesFiltradas.find(d => d.codd === this.devolucionSeleccionada?.codd) || this.devolucionesFiltradas[0];
      }
    } else {
      this.devolucionSeleccionada = null;
    }
  }

  seleccionarDevolucion(d: Devolucion) {
    this.devolucionSeleccionada = d;
  }

  get devolucionesPaginadas(): Devolucion[] {
    const start = (this.paginaActualHist - 1) * this.itemsPorPagina;
    return this.devolucionesFiltradas.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginasHist(): number {
    return Math.max(1, Math.ceil(this.devolucionesFiltradas.length / this.itemsPorPagina));
  }

  get paginasHistArray(): number[] {
    return Array.from({ length: this.totalPaginasHist }, (_, i) => i + 1);
  }

  solicitarAnularDevolucion(d: Devolucion) {
    this.confirmar('¿Seguro de Anular la Devolución? Los ejemplares devueltos volverán al estado prestado / pendiente.', () => {
      this.showConfirmDialog = false;
      if (d.codd) {
        this.devolucionService.anularDevolucion(d.codd).subscribe({
          next: () => {
            this.mostrarAviso('Devolución anulada. Ejemplares restaurados a pendientes.');
            this.cargarHistorialDevoluciones();
            this.cargarPrestamosPendientes();
          },
          error: (err) => this.mostrarError(err?.error?.message || 'Error al anular devolución')
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
}
