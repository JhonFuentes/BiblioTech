import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CatalogoMovilService, TextoMovil, EjemplarMovil } from '../../services/catalogo.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-disponibilidad-movil',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar style="--background: #2A2F63; --color: #ffffff; padding: 4px 8px;">
        <div slot="start" style="display: flex; align-items: center; gap: 10px; padding-left: 8px;">
          <img src="assets/Logo_BiblioTech.png" alt="Logo"
            style="width: 34px; height: 34px; object-fit: contain; background: #ffffff; border-radius: 9px; padding: 3px;" />
          <span style="font-weight: 800; font-size: 17px; color: #ffffff;">Ejemplares</span>
        </div>
        <ion-buttons slot="end">
          <ion-button (click)="theme.toggle()" title="Cambiar modo oscuro/claro">
            <ion-icon [name]="theme.isDark ? 'sunny-outline' : 'moon-outline'" style="color: #A7E0DB; font-size: 20px;"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="app-content">
      <div style="padding: 16px; max-width: 600px; margin: 0 auto;">
        <div class="glass-card" style="padding: 14px; margin-bottom: 14px;">
          <div style="position: relative;">
            <ion-icon name="search-outline" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 18px;"></ion-icon>
            <input type="text" [(ngModel)]="filtro" (input)="filtrar()"
              placeholder="Buscar texto por título o autor..."
              class="app-input"
              style="width: 100%; padding: 10px 12px 10px 38px; border-radius: 12px; border: 1px solid #cbd5e1; font-size: 13px; background: #ffffff; outline: none; box-sizing: border-box;" />
          </div>
        </div>

        <div *ngIf="cargando" style="text-align: center; padding: 32px;">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
        </div>

        <div *ngIf="!cargando" style="display: flex; flex-direction: column; gap: 12px;">
          <div *ngFor="let t of textosFiltrados" (click)="verEjemplares(t)"
            class="glass-card" style="padding: 16px; cursor: pointer;">
            <div class="card-title" style="font-size: 15px; font-weight: 800; color: #2A2F63;">{{ t.titulo }}</div>
            <div class="card-subtext" style="font-size: 12px; color: #475569; margin-top: 4px;">
              <strong>Autor(es):</strong> {{ t.autoresNombres?.join(', ') || 'N/A' }}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 12px;">
              <span class="card-subtext" style="color: #64748b;">{{ t.areaNombre }} • {{ t.editorialNombre }}</span>
              <span style="color: #5FB0C9; font-weight: 700;">Ver copias &rarr;</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Copias / Ejemplares Físicos del Texto -->
      <ion-modal [isOpen]="!!textoSeleccionado" (didDismiss)="textoSeleccionado = null">
        <ng-template>
          <div style="height: 100%; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; padding: 18px;">
            <div class="glass-card" style="padding: 22px; max-width: 420px; width: 100%; max-height: 85vh; overflow-y: auto;" *ngIf="textoSeleccionado">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #A7E0DB; padding-bottom: 10px; margin-bottom: 14px;">
                <h3 class="card-title" style="margin: 0; font-size: 16px; font-weight: 800; color: #2A2F63;">
                  Copias en Inventario
                </h3>
                <button type="button" (click)="textoSeleccionado = null" style="background: transparent; border: none; font-size: 22px; color: #64748b; cursor: pointer;">
                  &times;
                </button>
              </div>

              <div class="card-title" style="font-size: 13px; font-weight: 700; color: #2A2F63; margin-bottom: 12px;">
                {{ textoSeleccionado.titulo }}
              </div>

              <table class="app-table" style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden;">
                <thead>
                  <tr style="background: #A7E0DB; color: #2A2F63;">
                    <th style="padding: 8px; text-align: left; border-bottom: 2px solid #5FB0C9; border-right: 1px solid rgba(95,176,201,0.4);">Cod. Inv.</th>
                    <th style="padding: 8px; text-align: center; border-bottom: 2px solid #5FB0C9;">Disponibilidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let e of ejemplares" style="border-bottom: 1px solid #cbd5e1;">
                    <td style="padding: 8px; font-weight: 700; border-right: 1px solid #e2e8f0;">Cod. {{ e.codinv }}</td>
                    <td style="padding: 8px; text-align: center;">
                      <span class="badge-pill"
                        [style.background]="e.disponible === 1 ? '#d1fae5' : '#fef3c7'"
                        [style.color]="e.disponible === 1 ? '#047857' : '#b45309'">
                        {{ e.disponible === 1 ? 'Libre' : 'Ocupado' }}
                      </span>
                    </td>
                  </tr>
                  <tr *ngIf="ejemplares.length === 0">
                    <td colspan="2" style="padding: 14px; text-align: center; color: #64748b;">
                      No hay ejemplares físicos registrados para este texto.
                    </td>
                  </tr>
                </tbody>
              </table>

              <ion-button expand="block" (click)="textoSeleccionado = null" style="margin-top: 16px; --border-radius: 10px; font-weight: 700;">
                Cerrar
              </ion-button>
            </div>
          </div>
        </ng-template>
      </ion-modal>
    </ion-content>
  `
})
export class DisponibilidadPage implements OnInit {
  private catalogoService = inject(CatalogoMovilService);
  theme = inject(ThemeService);

  textos: TextoMovil[] = [];
  textosFiltrados: TextoMovil[] = [];
  filtro = '';
  cargando = false;

  textoSeleccionado: TextoMovil | null = null;
  ejemplares: EjemplarMovil[] = [];

  ngOnInit() {
    this.cargando = true;
    this.catalogoService.listarTextos().subscribe({
      next: (data) => {
        this.textos = (data || []).filter(t => t.estado === 1);
        this.filtrar();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  filtrar() {
    if (!this.filtro.trim()) {
      this.textosFiltrados = [...this.textos];
      return;
    }
    const q = this.filtro.toLowerCase().trim();
    this.textosFiltrados = this.textos.filter(t =>
      t.titulo.toLowerCase().includes(q) ||
      (t.autoresNombres && t.autoresNombres.some(a => a.toLowerCase().includes(q)))
    );
  }

  verEjemplares(t: TextoMovil) {
    this.textoSeleccionado = t;
    this.ejemplares = [];
    this.catalogoService.listarEjemplaresPorTexto(t.codt).subscribe(d => this.ejemplares = d || []);
  }
}
