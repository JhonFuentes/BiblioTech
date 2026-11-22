import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EjemplarService, Ejemplar } from '../../services/ejemplar.service';
import { TextoService, Texto } from '../../services/texto.service';
import { AreaService, Area } from '../../services/area.service';
import { EditorialService, Editorial } from '../../services/editorial.service';
import { TipoService, Tipo } from '../../services/tipo.service';
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
  private areaService = inject(AreaService);
  private editorialService = inject(EditorialService);
  private tipoService = inject(TipoService);

  // Catálogos para filtros de Textos (Maestro superior B-11)
  areas: Area[] = [];
  editoriales: Editorial[] = [];
  tiposDisponibles: Tipo[] = [];

  textos: Texto[] = [];
  textosFiltrados: Texto[] = [];
  filtroTexto = '';
  filtroEditorial: number | null = null;
  filtroArea: number | null = null;
  filtroTipo: number | null = null;
  filtroEstadoTexto = 'Activos'; // Activos, Bajas, Todos
  paginaTextoActual = 1;
  itemsTextoPorPagina = 5;

  selectedCodt: number | null = null;
  selectedTexto: Texto | null = null;

  // Detalle de Ejemplares (Inferior B-11)
  ejemplares: Ejemplar[] = [];
  ejemplaresFiltrados: Ejemplar[] = [];
  filtroEstado = 'Activos'; // [1] Activos, Bajas

  paginaActual = 1;
  itemsPorPagina = 10; // [2] 10 elementos por página
  menuAccionesAbierto: number | string | null = null;

  // Modales B-11.1 y B-11.2
  showFormModal = false;
  editMode = false;
  datoAnteriorCodinv: number | null = null;
  nuevoCodinv: number | null = null;
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
    this.cargarCatalogos();
    this.cargarTextos();
  }

  cargarCatalogos() {
    this.areaService.listar().subscribe(data => this.areas = data.filter(a => a.estado === 1));
    this.editorialService.listar().subscribe(data => this.editoriales = data.filter(e => e.estado === 1));
    this.tipoService.listar().subscribe(data => this.tiposDisponibles = data.filter(t => t.estado === 1));
  }

  cargarTextos() {
    this.textoService.listar().subscribe({
      next: (data) => {
        this.textos = data;
        this.aplicarFiltrosTexto();
      },
      error: (err) => console.error('Error al cargar textos', err)
    });
  }

  aplicarFiltrosTexto() {
    let temp = this.textos;
    if (this.filtroTexto && this.filtroTexto.trim()) {
      const q = this.filtroTexto.toLowerCase().trim();
      temp = temp.filter(t =>
        t.titulo.toLowerCase().includes(q) ||
        (t.autoresNombres && t.autoresNombres.some(a => a.toLowerCase().includes(q)))
      );
    }
    if (this.filtroEditorial) {
      temp = temp.filter(t => t.code === Number(this.filtroEditorial));
    }
    if (this.filtroArea) {
      temp = temp.filter(t => t.coda === Number(this.filtroArea));
    }
    if (this.filtroTipo) {
      temp = temp.filter(t => t.tipos?.some(tt => tt.codtipo === Number(this.filtroTipo)));
    }
    if (this.filtroEstadoTexto === 'Activos') {
      temp = temp.filter(t => t.estado === 1);
    } else if (this.filtroEstadoTexto === 'Bajas') {
      temp = temp.filter(t => t.estado === 0);
    }
    this.textosFiltrados = temp;
    this.paginaTextoActual = 1;

    if (this.textosFiltrados.length > 0) {
      if (!this.selectedCodt || !this.textosFiltrados.some(t => t.codt === this.selectedCodt)) {
        this.seleccionarTexto(this.textosFiltrados[0]);
      }
    } else {
      this.selectedCodt = null;
      this.selectedTexto = null;
      this.ejemplares = [];
      this.ejemplaresFiltrados = [];
    }
  }

  get textosPaginados(): Texto[] {
    const start = (this.paginaTextoActual - 1) * this.itemsTextoPorPagina;
    return this.textosFiltrados.slice(start, start + this.itemsTextoPorPagina);
  }

  get totalPaginasTexto(): number {
    return Math.max(1, Math.ceil(this.textosFiltrados.length / this.itemsTextoPorPagina));
  }

  get paginasTextoArray(): number[] {
    return Array.from({ length: this.totalPaginasTexto }, (_, i) => i + 1);
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
    const found = this.textos.find(t => t.codt === Number(this.selectedCodt));
    if (found) this.selectedTexto = found;
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

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  toggleMenuAcciones(e: Ejemplar, event: Event) {
    event.stopPropagation();
    this.menuAccionesAbierto = this.menuAccionesAbierto === e.codinv ? null : e.codinv || null;
  }

  cerrarMenuAcciones() {
    this.menuAccionesAbierto = null;
  }

  abrirAdicionar() {
    if (!this.selectedCodt) {
      this.mostrarAviso('Por favor seleccione un texto primero');
      return;
    }
    this.editMode = false;
    this.datoAnteriorCodinv = null;
    this.nuevoCodinv = null;
    this.currentEjemplar = {
      codt: this.selectedCodt,
      disponible: 1,
      estado: 1
    };
    this.showFormModal = true;
  }

  abrirModificar(e: Ejemplar) {
    this.editMode = true;
    this.datoAnteriorCodinv = e.codinv || null;
    this.nuevoCodinv = e.codinv || null;
    this.currentEjemplar = { ...e };
    this.showFormModal = true;
  }

  solicitarGuardar() {
    if (this.editMode) {
      if (!this.nuevoCodinv || Number(this.nuevoCodinv) <= 0) {
        this.mostrarAviso('Por favor ingrese un Nro. de Inventario Nuevo válido');
        return;
      }
      this.currentEjemplar.codinv = Number(this.nuevoCodinv);
    } else {
      if (!this.currentEjemplar.codinv || Number(this.currentEjemplar.codinv) <= 0) {
        this.mostrarAviso('Por favor ingrese un Nro. de Inventario válido (mayor a 0)');
        return;
      }
    }

    const mensaje = this.editMode 
      ? '¿Seguro de Modificar los Datos del Ejemplar?' 
      : '¿Seguro de Adicionar el Nuevo Ejemplar?';

    this.confirmar(mensaje, () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    if (this.editMode && this.datoAnteriorCodinv) {
      this.ejemplarService.modificar(this.datoAnteriorCodinv, this.currentEjemplar).subscribe({
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
