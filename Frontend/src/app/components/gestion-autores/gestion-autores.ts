import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutorService, Autor } from '../../services/autor.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-autores',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-autores.html',
  styleUrls: ['./gestion-autores.css']
})
export class GestionAutores implements OnInit {
  private autorService = inject(AutorService);

  autores: Autor[] = [];
  autoresFiltrados: Autor[] = [];
  filtroNombre = '';
  filtroEstado = 'Todos'; // Activos, Bajas, Todos
  paginaActual = 1;
  itemsPorPagina = 15;

  menuAccionesAbierto: number | string | null = null;

  @HostListener('document:click')
  onClickOutside() {
    this.menuAccionesAbierto = null;
  }

  toggleMenuAcciones(a: Autor, event: Event) {
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

  @HostListener('window:resize')
  onWindowResize() {
    this.ajustarItemsPorPagina();
  }

  ajustarItemsPorPagina() {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) {
        this.itemsPorPagina = 5;
      } else if (width < 1024) {
        this.itemsPorPagina = 10;
      } else {
        this.itemsPorPagina = 15;
      }
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = Math.max(1, this.totalPaginas);
      }
    }
  }

  // Modals state
  showFormModal = false;
  editMode = false;
  currentAutor: Autor = { nombre: '', ap: '', am: '', genero: 'M' };

  // View / Print modal (V)
  showVerModal = false;
  autorAver: Autor | null = null;

  // Confirm dialog (B-5)
  showConfirmDialog = false;
  dialogTipo: 'confirm' | 'aviso' | 'error' | 'success' = 'confirm';
  dialogSoloAceptar = false;
  confirmMensaje = '';
  confirmAccion: () => void = () => {};

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
    this.cargarAutores();
  }

  cargarAutores() {
    this.autorService.listar().subscribe({
      next: (data) => {
        this.autores = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar autores', err)
    });
  }

  aplicarFiltros() {
    let temp = this.autores;
    if (this.filtroNombre && this.filtroNombre.trim()) {
      const q = this.filtroNombre.toLowerCase().trim();
      temp = temp.filter(a => {
        const full = `${a.nombre || ''} ${a.ap || ''} ${a.am || ''} ${a.ap || ''} ${a.am || ''} ${a.nombre || ''}`.toLowerCase();
        return full.includes(q);
      });
    }
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(a => a.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(a => a.estado === 0);
    }
    this.autoresFiltrados = temp;
    this.paginaActual = 1;
  }

  get autoresPaginados(): Autor[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.autoresFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.autoresFiltrados.length / this.itemsPorPagina));
  }

  // B-9.1 Adicionar
  abrirAdicionar() {
    this.editMode = false;
    this.currentAutor = { nombre: '', ap: '', am: '', genero: 'M' };
    this.showFormModal = true;
  }

  // B-9.2 Modificar
  abrirModificar(a: Autor) {
    this.editMode = true;
    this.currentAutor = { ...a };
    this.showFormModal = true;
  }

  // [V] Visualizar e Imprimir
  abrirVer(a: Autor) {
    this.autorAver = a;
    this.showVerModal = true;
  }

  imprimirVista() {
    window.print();
  }

  solicitarGuardar() {
    if (!this.currentAutor.nombre || !this.currentAutor.nombre.trim()) {
      this.mostrarAviso('Por favor ingrese el nombre del autor');
      return;
    }

    const mensaje = this.editMode 
      ? '¿Seguro de Modificar los Datos del Autor?' 
      : '¿Seguro de Adicionar el Nuevo Autor?';

    this.confirmar(mensaje, () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    if (this.editMode && this.currentAutor.coda) {
      this.autorService.modificar(this.currentAutor.coda, this.currentAutor).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarAutores();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al modificar autor')
      });
    } else {
      this.autorService.crear(this.currentAutor).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarAutores();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al guardar autor')
      });
    }
  }

  // B-9.3 Eliminar (Baja lógica)
  eliminar(a: Autor) {
    this.confirmar('¿Seguro de Eliminar el Autor?', () => {
      this.showConfirmDialog = false;
      if (a.coda) {
        this.autorService.eliminar(a.coda).subscribe({
          next: () => this.cargarAutores(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al dar de baja autor')
        });
      }
    });
  }

  // B-9.4 Habilitar
  habilitar(a: Autor) {
    this.confirmar('¿Seguro de Habilitar el Autor?', () => {
      this.showConfirmDialog = false;
      if (a.coda) {
        this.autorService.habilitar(a.coda).subscribe({
          next: () => this.cargarAutores(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al habilitar autor')
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
