import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorialService, Editorial } from '../../services/editorial.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-editoriales',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-editoriales.html',
  styleUrls: ['./gestion-editoriales.css']
})
export class GestionEditoriales implements OnInit {
  private editorialService = inject(EditorialService);

  editoriales: Editorial[] = [];
  editorialesFiltradas: Editorial[] = [];
  filtroNombre = '';
  filtroEstado = 'Todos'; // Activos, Bajas, Todos
  paginaActual = 1;
  itemsPorPagina = 15;

  menuAccionesAbierto: number | string | null = null;

  @HostListener('document:click')
  onClickOutside() {
    this.menuAccionesAbierto = null;
  }

  toggleMenuAcciones(ed: Editorial, event: Event) {
    event.stopPropagation();
    if (this.menuAccionesAbierto === ed.code) {
      this.menuAccionesAbierto = null;
    } else {
      this.menuAccionesAbierto = ed.code || null;
    }
  }

  cerrarMenuAcciones() {
    this.menuAccionesAbierto = null;
  }


  showFormModal = false;
  editMode = false;
  currentEditorial: Editorial = { nombre: '' ,nivel:0};


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
    this.cargarEditoriales();
  }

  cargarEditoriales() {
    this.editorialService.listar().subscribe({
      next: (data) => {
        this.editoriales = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar editoriales', err)
    });
  }

  aplicarFiltros() {
    let temp = this.editoriales;
    if (this.filtroNombre && this.filtroNombre.trim()) {
      const q = this.filtroNombre.toLowerCase().trim();
      temp = temp.filter(e => e.nombre.toLowerCase().includes(q));
    }
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(e => e.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(e => e.estado === 0);
    }
    this.editorialesFiltradas = temp;
    this.paginaActual = 1;
  }

  get editorialesPaginadas(): Editorial[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.editorialesFiltradas.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.editorialesFiltradas.length / this.itemsPorPagina));
  }

  //  Adicionar
  abrirAdicionar() {
    this.editMode = false;
    this.currentEditorial = { nombre: '' };
    this.showFormModal = true;
  }

  //  Modificar
  abrirModificar(e: Editorial) {
    this.editMode = true;
    this.currentEditorial = { ...e };
    this.showFormModal = true;
  }

  solicitarGuardar() {
    if (!this.currentEditorial.nombre || !this.currentEditorial.nombre.trim() || !this.currentEditorial.nivel) {
      this.mostrarAviso('Por favor ingrese el nombre de la editorial y el nivel');
      return;
    }

    const mensaje = this.editMode 
      ? '¿Seguro de Modificar los Datos de la Editorial?' 
      : '¿Seguro de Adicionar la Nueva Editorial?';

    this.confirmar(mensaje, () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    if (this.editMode && this.currentEditorial.code) {
      this.editorialService.modificar(this.currentEditorial.code, this.currentEditorial).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarEditoriales();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al modificar editorial')
      });
    } else {
      this.editorialService.crear(this.currentEditorial).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarEditoriales();
        },
        error: (err) => this.mostrarError(err?.error?.message || 'Error al guardar editorial')
      });
    }
  }

  //  Eliminar (Baja lógica)
  eliminar(e: Editorial) {
    this.confirmar('¿Seguro de Eliminar la Editorial?', () => {
      this.showConfirmDialog = false;
      if (e.code) {
        this.editorialService.eliminar(e.code).subscribe({
          next: () => this.cargarEditoriales(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al dar de baja editorial')
        });
      }
    });
  }

  //  Habilitar
  habilitar(e: Editorial) {
    this.confirmar('¿Seguro de Habilitar la Editorial?', () => {
      this.showConfirmDialog = false;
      if (e.code) {
        this.editorialService.habilitar(e.code).subscribe({
          next: () => this.cargarEditoriales(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al habilitar editorial')
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
