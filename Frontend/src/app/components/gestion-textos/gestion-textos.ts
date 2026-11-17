import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextoService, Texto, TipoTexto } from '../../services/texto.service';
import { AreaService, Area } from '../../services/area.service';
import { EditorialService, Editorial } from '../../services/editorial.service';
import { TipoService, Tipo } from '../../services/tipo.service';
import { AutorService, Autor } from '../../services/autor.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-textos',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-textos.html',
  styleUrls: ['./gestion-textos.css']
})
export class GestionTextos implements OnInit {
  private textoService = inject(TextoService);
  private areaService = inject(AreaService);
  private editorialService = inject(EditorialService);
  private tipoService = inject(TipoService);
  private autorService = inject(AutorService);

  textos: Texto[] = [];
  textosFiltrados: Texto[] = [];

  areas: Area[] = [];
  editoriales: Editorial[] = [];
  tiposDisponibles: Tipo[] = [];
  autoresDisponibles: Autor[] = [];

  // Filtros
  filtro = '';
  filtroArea: number | null = null;
  filtroEditorial: number | null = null;
  filtroTipo: number | null = null;
  filtroEstado = 'Todos';

  paginaActual = 1;
  itemsPorPagina = 15;
  menuAccionesAbierto: number | string | null = null;

  // Modales
  showFormModal = false;
  editMode = false;
  currentTexto: Texto = this.getEmptyTexto();

  // Gestión de Autores en el modal
  autorSeleccionadoId: number | null = null;

  // Gestión de Tipos y Documentos en el modal
  tiposSeleccionados: { [codtipo: number]: boolean } = {};
  documentosPorTipo: { [codtipo: number]: string } = {};
  uploadingFileTipo: number | null = null;

  // Visualizar / Imprimir
  showVerModal = false;
  textoAver: Texto | null = null;

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
      else if (width < 1024) this.itemsPorPagina = 10;
      else this.itemsPorPagina = 15;
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
    this.autorService.listar().subscribe(data => this.autoresDisponibles = data.filter(a => a.estado === 1));
  }

  cargarTextos() {
    this.textoService.listar().subscribe({
      next: (data) => {
        this.textos = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar textos', err)
    });
  }

  aplicarFiltros() {
    let temp = this.textos;
    if (this.filtro && this.filtro.trim()) {
      const q = this.filtro.toLowerCase().trim();
      temp = temp.filter(t => {
        const matchTitulo = t.titulo.toLowerCase().includes(q);
        const matchAutor = t.autoresNombres?.some(a => a.toLowerCase().includes(q));
        return matchTitulo || matchAutor;
      });
    }
    if (this.filtroArea) {
      temp = temp.filter(t => t.coda === Number(this.filtroArea));
    }
    if (this.filtroEditorial) {
      temp = temp.filter(t => t.code === Number(this.filtroEditorial));
    }
    if (this.filtroTipo) {
      temp = temp.filter(t => t.tipos?.some(tt => tt.codtipo === Number(this.filtroTipo)));
    }
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(t => t.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(t => t.estado === 0);
    }
    this.textosFiltrados = temp;
    this.paginaActual = 1;
  }

  get textosPaginados(): Texto[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.textosFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.textosFiltrados.length / this.itemsPorPagina));
  }

  getEmptyTexto(): Texto {
    return {
      titulo: '',
      resumen: '',
      isbn: '',
      edicion: 1,
      fechapub: new Date().toISOString().substring(0, 10),
      coda: 0,
      code: 0,
      autorIds: [],
      autoresNombres: [],
      tipos: []
    };
  }

  toggleMenuAcciones(t: Texto, event: Event) {
    event.stopPropagation();
    this.menuAccionesAbierto = this.menuAccionesAbierto === t.codt ? null : t.codt || null;
  }

  abrirAdicionar() {
    this.editMode = false;
    this.currentTexto = this.getEmptyTexto();
    this.tiposSeleccionados = {};
    this.documentosPorTipo = {};
    this.autorSeleccionadoId = null;
    this.showFormModal = true;
  }

  abrirModificar(t: Texto) {
    this.editMode = true;
    this.currentTexto = {
      ...t,
      autorIds: t.autorIds ? [...t.autorIds] : [],
      autoresNombres: t.autoresNombres ? [...t.autoresNombres] : []
    };
    this.tiposSeleccionados = {};
    this.documentosPorTipo = {};
    if (t.tipos) {
      t.tipos.forEach(tt => {
        this.tiposSeleccionados[tt.codtipo] = true;
        if (tt.docum) this.documentosPorTipo[tt.codtipo] = tt.docum;
      });
    }
    this.autorSeleccionadoId = null;
    this.showFormModal = true;
  }

  abrirVer(t: Texto) {
    this.textoAver = t;
    this.showVerModal = true;
  }

  imprimirVista() {
    window.print();
  }

  agregarAutor() {
    if (!this.autorSeleccionadoId) return;
    const autor = this.autoresDisponibles.find(a => a.coda === Number(this.autorSeleccionadoId));
    if (!autor || !autor.coda) return;

    if (!this.currentTexto.autorIds) this.currentTexto.autorIds = [];
    if (!this.currentTexto.autoresNombres) this.currentTexto.autoresNombres = [];

    if (!this.currentTexto.autorIds.includes(autor.coda)) {
      this.currentTexto.autorIds.push(autor.coda);
      const nombreCompleto = (autor.nombre + ' ' + (autor.ap || '')).trim();
      this.currentTexto.autoresNombres.push(nombreCompleto);
    }
    this.autorSeleccionadoId = null;
  }

  quitarAutor(index: number) {
    this.currentTexto.autorIds?.splice(index, 1);
    this.currentTexto.autoresNombres?.splice(index, 1);
  }

  onFileSelected(codtipo: number, event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.uploadingFileTipo = codtipo;
    this.textoService.uploadDocumento(file).subscribe({
      next: (res) => {
        this.documentosPorTipo[codtipo] = res.fileName;
        this.uploadingFileTipo = null;
      },
      error: (err) => {
        this.uploadingFileTipo = null;
        this.mostrarError(err?.error?.message || 'Error al subir el archivo');
      }
    });
  }

  solicitarGuardar() {
    if (!this.currentTexto.titulo || !this.currentTexto.titulo.trim()) {
      this.mostrarAviso('Por favor ingrese el título del texto');
      return;
    }
    if (!this.currentTexto.coda) {
      this.mostrarAviso('Por favor seleccione un área temática');
      return;
    }
    if (!this.currentTexto.code) {
      this.mostrarAviso('Por favor seleccione una editorial');
      return;
    }

    // Armar lista de tipos seleccionados
    const tiposList: TipoTexto[] = [];
    for (const t of this.tiposDisponibles) {
      if (t.codtipo && this.tiposSeleccionados[t.codtipo]) {
        tiposList.push({
          codtipo: t.codtipo,
          tipoNombre: t.nombre,
          sw: t.sw,
          docum: this.documentosPorTipo[t.codtipo] || ''
        });
      }
    }
    this.currentTexto.tipos = tiposList;

    // Validación duplicado en frontend
    const tituloNorm = this.currentTexto.titulo.trim().toLowerCase();
    const edicion = this.currentTexto.edicion || 1;
    const duplicado = this.textos.find(t => 
      t.titulo.trim().toLowerCase() === tituloNorm &&
      (t.edicion || 1) === edicion &&
      (!this.editMode || t.codt !== this.currentTexto.codt)
    );

    if (duplicado) {
      if (duplicado.estado === 1) {
        this.mostrarAviso(`Ya existe un texto activo con el título "${this.currentTexto.titulo.trim()}" y edición ${edicion}`);
      } else {
        this.mostrarAviso(`Ya existe un texto con el título "${this.currentTexto.titulo.trim()}", pero se encuentra dado de baja.`);
      }
      return;
    }

    const mensaje = this.editMode 
      ? '¿Seguro de Modificar los Datos del Texto?' 
      : '¿Seguro de Adicionar el Nuevo Texto?';

    this.confirmar(mensaje, () => this.guardar());
  }

  guardar() {
    this.showConfirmDialog = false;
    if (this.editMode && this.currentTexto.codt) {
      this.textoService.modificar(this.currentTexto.codt, this.currentTexto).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarTextos();
        },
        error: (err) => {
          this.mostrarError(err?.error?.message || 'Error al modificar texto');
        }
      });
    } else {
      this.textoService.crear(this.currentTexto).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargarTextos();
        },
        error: (err) => {
          this.mostrarError(err?.error?.message || 'Error al guardar texto');
        }
      });
    }
  }

  eliminar(t: Texto) {
    this.confirmar('¿Seguro de Eliminar el Texto?', () => {
      this.showConfirmDialog = false;
      if (t.codt) {
        this.textoService.eliminar(t.codt).subscribe({
          next: () => this.cargarTextos(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al dar de baja el texto')
        });
      }
    });
  }

  habilitar(t: Texto) {
    this.confirmar('¿Seguro de Habilitar el Texto?', () => {
      this.showConfirmDialog = false;
      if (t.codt) {
        this.textoService.habilitar(t.codt).subscribe({
          next: () => this.cargarTextos(),
          error: (err) => this.mostrarError(err?.error?.message || 'Error al habilitar el texto')
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

  cerrarVerModal() {
    this.showVerModal = false;
  }
}
