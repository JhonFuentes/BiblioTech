import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { CatalogoMovilService, TextoMovil } from '../../services/catalogo.service';

@Component({
  selector: 'app-catalogo-movil',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar style="--background: #2A2F63; --color: #ffffff; padding: 4px 8px;">
        <ion-title style="font-weight: 800; font-size: 17px;">
          Catálogo Digital
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #f1f5f9;">
      <div style="padding: 16px; max-width: 600px; margin: 0 auto;">
        <!-- Buscador Multicriterio -->
        <div class="glass-card" style="padding: 14px; margin-bottom: 14px;">
          <div style="position: relative; margin-bottom: 10px;">
            <ion-icon name="search-outline" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 18px;"></ion-icon>
            <input type="text" [(ngModel)]="filtroTitulo" (input)="buscar()"
              placeholder="Buscar libro digital por título..."
              style="width: 100%; padding: 10px 12px 10px 38px; border-radius: 12px; border: 1px solid #cbd5e1; font-size: 13px; background: #ffffff; outline: none; box-sizing: border-box;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <input type="text" [(ngModel)]="filtroAutor" (input)="buscar()"
              placeholder="Filtrar por autor..."
              style="width: 100%; padding: 9px 12px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 12px; background: #ffffff; outline: none; box-sizing: border-box;" />

            <select [(ngModel)]="selectedCoda" (change)="buscar()"
              style="width: 100%; padding: 9px 10px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 12px; background: #ffffff; outline: none;">
              <option [ngValue]="undefined">Todas las áreas</option>
              <option *ngFor="let a of areas" [ngValue]="a.coda">{{ a.nombre }}</option>
            </select>
          </div>
        </div>

        <div *ngIf="cargando" style="text-align: center; padding: 32px;">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
        </div>

        <!-- Resultados Digitales -->
        <div *ngIf="!cargando" style="display: flex; flex-direction: column; gap: 12px;">
          <div *ngFor="let t of resultados" class="glass-card" style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <h3 style="margin: 0; font-size: 15px; font-weight: 800; color: #2A2F63; line-height: 1.35;">
                {{ t.titulo }}
              </h3>
              <span class="badge-pill" style="background: #f3e8ff; color: #7e22ce; flex-shrink: 0;">
                PDF Digital
              </span>
            </div>

            <div style="font-size: 12px; color: #475569; margin-top: 6px;">
              <strong>Autor(es):</strong> {{ t.autoresNombres?.join(', ') || 'Sin autor' }}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">
              {{ t.areaNombre }} • {{ t.editorialNombre }} {{ t.edicion ? '• Ed. ' + t.edicion : '' }}
            </div>
            <p *ngIf="t.resumen" style="font-size: 12px; color: #64748b; margin: 8px 0 0; line-height: 1.4;">
              {{ t.resumen }}
            </p>

            <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
              <ion-button size="small" (click)="abrirVisor(t)" style="--border-radius: 10px; font-weight: 700;">
                <ion-icon name="eye-outline" slot="start"></ion-icon> Leer Documento
              </ion-button>
            </div>
          </div>

          <div *ngIf="resultados.length === 0" class="glass-card" style="padding: 28px; text-align: center; color: #64748b;">
            <ion-icon name="book-outline" style="font-size: 38px; color: #94a3b8; margin-bottom: 8px;"></ion-icon>
            <p style="margin: 0; font-size: 13px; font-weight: 600;">No se encontraron ejemplares digitales.</p>
          </div>
        </div>
      </div>

      <!-- Modal Visor de PDF Embebido -->
      <ion-modal [isOpen]="!!textoVisualizando" (didDismiss)="cerrarVisor()">
        <ng-template>
          <div style="height: 100%; display: flex; flex-direction: column; background: #1e293b;" *ngIf="textoVisualizando">
            <div style="background: #2A2F63; color: #ffffff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 800; font-size: 14px; padding-right: 10px;">
                {{ textoVisualizando.titulo }}
              </div>
              <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                <a [href]="rawUrl" target="_blank" rel="noopener"
                  style="background: #3E6D9C; color: #ffffff; text-decoration: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 700;">
                  Abrir PDF
                </a>
                <button type="button" (click)="cerrarVisor()" style="background: transparent; border: none; color: #ffffff; font-size: 22px; cursor: pointer;">
                  &times;
                </button>
              </div>
            </div>
            <div style="flex: 1;">
              <iframe *ngIf="safeUrl" [src]="safeUrl" style="width: 100%; height: 100%; border: 0;"></iframe>
            </div>
          </div>
        </ng-template>
      </ion-modal>

      <!-- Modal de Aviso -->
      <ion-modal [isOpen]="showAviso" (didDismiss)="showAviso = false">
        <ng-template>
          <div style="height: 100%; background: rgba(42,47,99,0.45); display: flex; align-items: center; justify-content: center; padding: 24px;">
            <div class="glass-card" style="padding: 22px; max-width: 340px; width: 100%; text-align: center;">
              <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 800; color: #2A2F63;">Aviso</h3>
              <p style="margin: 0 0 16px; font-size: 13px; color: #475569;">{{ avisoMensaje }}</p>
              <ion-button expand="block" (click)="showAviso = false" style="--border-radius: 10px; font-weight: 700;">Aceptar</ion-button>
            </div>
          </div>
        </ng-template>
      </ion-modal>
    </ion-content>
  `
})
export class CatalogoPage implements OnInit {
  private catalogoService = inject(CatalogoMovilService);
  private sanitizer = inject(DomSanitizer);

  filtroTitulo = '';
  filtroAutor = '';
  selectedCoda?: number;
  areas: { coda: number; nombre: string; estado: number }[] = [];
  resultados: TextoMovil[] = [];
  cargando = false;

  textoVisualizando: TextoMovil | null = null;
  safeUrl: SafeResourceUrl | null = null;
  rawUrl = '';

  showAviso = false;
  avisoMensaje = '';

  ngOnInit() {
    this.catalogoService.listarAreas().subscribe(d => this.areas = (d || []).filter(a => a.estado === 1));
    this.buscar();
  }

  buscar() {
    this.cargando = true;
    this.catalogoService.buscarDigitales(this.filtroTitulo, this.filtroAutor, this.selectedCoda).subscribe({
      next: (res) => {
        this.resultados = res?.items || [];
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  abrirVisor(t: TextoMovil) {
    const doc = t.tipos?.find(tp => tp.docum && tp.docum.trim().length > 0)?.docum;
    if (!doc) {
      this.avisoMensaje = 'Este ejemplar digital aún no tiene un archivo PDF adjunto.';
      this.showAviso = true;
      return;
    }
    this.textoVisualizando = t;
    this.rawUrl = this.catalogoService.getDocumentoUrl(doc);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
  }

  cerrarVisor() {
    this.textoVisualizando = null;
    this.safeUrl = null;
  }
}

