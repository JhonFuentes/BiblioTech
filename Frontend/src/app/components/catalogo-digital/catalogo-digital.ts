import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CatalogoDigitalService } from '../../services/catalogo-digital.service';
import { Texto } from '../../services/texto.service';
import { AreaService, Area } from '../../services/area.service';
import { EditorialService, Editorial } from '../../services/editorial.service';
import { TipoService, Tipo } from '../../services/tipo.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-catalogo-digital',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './catalogo-digital.html'
})
export class CatalogoDigital implements OnInit {
  private catalogoService = inject(CatalogoDigitalService);
  private areaService = inject(AreaService);
  private editorialService = inject(EditorialService);
  private tipoService = inject(TipoService);
  private sanitizer = inject(DomSanitizer);

  query = '';
  selectedCoda?: number;
  selectedCode?: number;
  selectedCodtipo?: number;

  areas: Area[] = [];
  editoriales: Editorial[] = [];
  tiposDigitales: Tipo[] = [];

  resultados: Texto[] = [];
  totalEncontrados = 0;
  cargando = false;

  // B-20.1 Modal Visor de Ejemplar Digital
  showViewerModal = false;
  textoVisualizando: Texto | null = null;
  safeDocumentUrl: SafeResourceUrl | null = null;
  rawDocumentUrl = '';

  showConfirmDialog = false;
  dialogTipo: 'confirm' | 'aviso' | 'error' | 'success' = 'aviso';
  confirmMensaje = '';

  ngOnInit() {
    this.cargarFiltros();
    this.buscar();
  }

  cargarFiltros() {
    this.areaService.listar('', 1).subscribe({ next: (d) => this.areas = d.filter(a => a.estado === 1) });
    this.editorialService.listar('', 1).subscribe({ next: (d) => this.editoriales = d.filter(e => e.estado === 1) });
    this.tipoService.listar('', 1).subscribe({ next: (d) => this.tiposDigitales = d.filter(t => t.estado === 1 && t.sw === 1) });
  }

  buscar() {
    this.cargando = true;
    this.catalogoService.buscar(
      this.query.trim() || undefined,
      this.selectedCoda || undefined,
      this.selectedCode || undefined,
      this.selectedCodtipo || undefined
    ).subscribe({
      next: (res) => {
        this.resultados = res.items || [];
        this.totalEncontrados = res.total || 0;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarAviso('Error al consultar el catálogo digital');
      }
    });
  }

  limpiarFiltros() {
    this.query = '';
    this.selectedCoda = undefined;
    this.selectedCode = undefined;
    this.selectedCodtipo = undefined;
    this.buscar();
  }

  obtenerDocum(t: Texto): string | undefined {
    const tipoDoc = t.tipos?.find(tp => tp.docum && tp.docum.trim().length > 0);
    return tipoDoc?.docum;
  }

  visualizarEjemplar(t: Texto) {
    const docum = this.obtenerDocum(t);
    if (!docum) {
      this.mostrarAviso('Este texto digital aún no tiene un archivo PDF/EPUB adjunto en el servidor.');
      return;
    }
    this.textoVisualizando = t;
    this.rawDocumentUrl = this.catalogoService.getDocumentUrl(docum);
    this.safeDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawDocumentUrl);
    this.showViewerModal = true;
  }

  cerrarVisor() {
    this.showViewerModal = false;
    this.textoVisualizando = null;
    this.safeDocumentUrl = null;
  }

  mostrarAviso(mensaje: string) {
    this.dialogTipo = 'aviso';
    this.confirmMensaje = mensaje;
    this.showConfirmDialog = true;
  }
}
