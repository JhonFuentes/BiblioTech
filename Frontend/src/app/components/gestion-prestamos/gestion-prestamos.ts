import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrestamoService, Prestamo, DetallePrestamo } from '../../services/prestamo.service';
import { EjemplarService, Ejemplar } from '../../services/ejemplar.service';
import { PersonaService, Persona } from '../../services/persona.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-prestamos.html',
  styleUrls: ['./gestion-prestamos.css']
})
export class GestionPrestamos implements OnInit {
  private prestamoService = inject(PrestamoService);
  private ejemplarService = inject(EjemplarService);
  private personaService = inject(PersonaService);

  prestamos: Prestamo[] = [];
  prestamosFiltrados: Prestamo[] = [];
  ejemplaresLibres: Ejemplar[] = [];
  personas: Persona[] = [];

  // Filtros
  fechaInicio = '';
  fechaFin = '';
  filtroEstudiante = '';
  filtroEstado = 'Activos'; // Activos, Bajas, Todos

  paginaActual = 1;
  itemsPorPagina = 15;

  // Modal Nuevo Préstamo (B-12.1)
  showFormModal = false;
  currentPrestamo: Prestamo = this.getEmptyPrestamo();
  filasEjemplares: number[] = [0]; // Codigos de inventario seleccionados por fila

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
      else if (width < 1024) this.itemsPorPagina = 10;
      else this.itemsPorPagina = 15;
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = Math.max(1, this.totalPaginas);
      }
    }
  }

  ngOnInit() {
    this.ajustarItemsPorPagina();
    this.cargarPrestamos();
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.ejemplarService.listarLibres().subscribe(data => this.ejemplaresLibres = data);
    this.personaService.listar().subscribe(data => this.personas = data.filter(p => p.estado === 1));
  }

  cargarPrestamos() {
    this.prestamoService.listar().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar préstamos', err)
    });
  }

  aplicarFiltros() {
    let temp = this.prestamos;
    if (this.filtroEstudiante && this.filtroEstudiante.trim()) {
      const q = this.filtroEstudiante.toLowerCase().trim();
      temp = temp.filter(p => 
        (p.estudianteNombre && p.estudianteNombre.toLowerCase().includes(q)) ||
        (p.ci && p.ci.toString().includes(q))
      );
    }
    if (this.fechaInicio) {
      temp = temp.filter(p => p.fecha ? p.fecha >= this.fechaInicio : true);
    }
    if (this.fechaFin) {
      temp = temp.filter(p => p.fecha ? p.fecha <= this.fechaFin : true);
    }
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(p => p.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(p => p.estado === 0);
    }
    this.prestamosFiltrados = temp;
    this.paginaActual = 1;
  }

  get prestamosPaginados(): Prestamo[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.prestamosFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.prestamosFiltrados.length / this.itemsPorPagina));
  }

  getEmptyPrestamo(): Prestamo {
    const hoy = new Date().toISOString().substring(0, 10);
    const enSieteDias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    return {
      fecha: hoy,
      fini: hoy,
      ffin: enSieteDias,
      tipopres: 1, // 1=Domicilio, 2=Sala
      ci: 0,
      detalles: []
    };
  }

  abrirAdicionar() {
    this.cargarCatalogos();
    this.currentPrestamo = this.getEmptyPrestamo();
    this.filasEjemplares = [0];
    this.showFormModal = true;
  }

  agregarFilaEjemplar() {
    this.filasEjemplares.push(0);
  }

  quitarFilaEjemplar(index: number) {
    if (this.filasEjemplares.length > 1) {
      this.filasEjemplares.splice(index, 1);
    }
  }

  solicitarGuardar() {
    if (!this.currentPrestamo.ci) {
      this.mostrarAviso('Por favor ingrese o seleccione la Cédula (CI) del estudiante');
      return;
    }
    if (!this.currentPrestamo.fini || !this.currentPrestamo.ffin) {
      this.mostrarAviso('Por favor asigne las fechas de inicio y fin del préstamo');
      return;
    }

    // Filtrar ejemplares válidos
    const codinvs = this.filasEjemplares.filter(c => c > 0);
    if (codinvs.length === 0) {
      this.mostrarAviso('Por favor seleccione al menos un ejemplar disponible');
      return;
    }

    // Validar duplicados en las filas seleccionadas
    const unicos = new Set(codinvs);
    if (unicos.size !== codinvs.length) {
      this.mostrarAviso('No puede seleccionar el mismo ejemplar más de una vez');
      return;
    }

    this.currentPrestamo.detalles = codinvs.map(c => ({ codinv: c }));

    this.confirmar('¿Seguro de Registrar el Nuevo Préstamo?', () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    this.prestamoService.crear(this.currentPrestamo).subscribe({
      next: () => {
        this.showFormModal = false;
        this.cargarPrestamos();
        this.cargarCatalogos();
      },
      error: (err) => this.mostrarError(err?.error?.message || 'Error al registrar el préstamo')
    });
  }

  eliminar(p: Prestamo) {
    this.confirmar('¿Seguro de Eliminar el Préstamo? Los ejemplares prestados se liberarán automáticamente.', () => {
      this.showConfirmDialog = false;
      if (p.codp) {
        this.prestamoService.eliminar(p.codp).subscribe({
          next: () => {
            this.cargarPrestamos();
            this.cargarCatalogos();
          },
          error: (err) => this.mostrarError(err?.error?.message || 'Error al eliminar el préstamo')
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
