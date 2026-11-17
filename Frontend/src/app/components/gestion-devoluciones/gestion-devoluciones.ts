import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  activeTab: 'registrar' | 'historial' = 'registrar';

  // Tab 1: Registrar Devolución (B-13)
  prestamosPendientes: Prestamo[] = [];
  prestamosFiltrados: Prestamo[] = [];
  filtroEstudianteReg = '';
  filtroCodinvReg: number | null = null;
  prestamoSeleccionado: Prestamo | null = null;
  ejemplaresADevolver: { [codinv: number]: boolean } = {};

  // Tab 2: Historial y Anulación (B-14)
  devoluciones: Devolucion[] = [];
  devolucionesFiltradas: Devolucion[] = [];
  filtroEstudianteHist = '';
  filtroEstadoHist = 'Activos'; // Activos, Bajas, Todos

  paginaActualReg = 1;
  paginaActualHist = 1;
  itemsPorPagina = 10;

  // Diálogo B-5
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
      if (width < 640) this.itemsPorPagina = 5;
      else if (width < 1024) this.itemsPorPagina = 8;
      else this.itemsPorPagina = 10;
    }
  }

  ngOnInit() {
    this.ajustarItemsPorPagina();
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
    this.devolucionService.listarPrestamosPendientes().subscribe({
      next: (data) => {
        this.prestamosPendientes = data;
        this.aplicarFiltrosReg();
        if (this.prestamosPendientes.length > 0 && !this.prestamoSeleccionado) {
          this.seleccionarPrestamo(this.prestamosPendientes[0]);
        }
      },
      error: (err) => console.error('Error al cargar pendientes', err)
    });
  }

  aplicarFiltrosReg() {
    let temp = this.prestamosPendientes;
    if (this.filtroEstudianteReg && this.filtroEstudianteReg.trim()) {
      const q = this.filtroEstudianteReg.toLowerCase().trim();
      temp = temp.filter(p => 
        (p.estudianteNombre && p.estudianteNombre.toLowerCase().includes(q)) ||
        (p.ci && p.ci.toString().includes(q))
      );
    }
    if (this.filtroCodinvReg) {
      temp = temp.filter(p => p.detalles?.some(d => d.codinv === Number(this.filtroCodinvReg)));
    }
    this.prestamosFiltrados = temp;
    this.paginaActualReg = 1;
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
  }

  get devolucionesPaginadas(): Devolucion[] {
    const start = (this.paginaActualHist - 1) * this.itemsPorPagina;
    return this.devolucionesFiltradas.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginasHist(): number {
    return Math.max(1, Math.ceil(this.devolucionesFiltradas.length / this.itemsPorPagina));
  }

  solicitarAnularDevolucion(d: Devolucion) {
    this.confirmar('¿Seguro de Anular la Devolución? Los ejemplares devueltos volverán al estado prestado / pendiente.', () => {
      this.showConfirmDialog = false;
      if (d.codd) {
        this.devolucionService.anularDevolucion(d.codd).subscribe({
          next: () => {
            this.mostrarAviso('Devolución anulada. Ejemplares restaurados a pendientes.');
            this.cargarHistorialDevoluciones();
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
