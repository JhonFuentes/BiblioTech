import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService, UserSession } from '../../services/auth.service';
import { PrestamoMovilService, PrestamoMovil } from '../../services/prestamo.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-prestamos-movil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar style="--background: #2A2F63; --color: #ffffff; padding: 4px 8px;">
        <div slot="start" style="display: flex; align-items: center; gap: 10px; padding-left: 8px;">
          <img src="assets/Logo_BiblioTech.png" alt="Logo"
            style="width: 34px; height: 34px; object-fit: contain; background: #ffffff; border-radius: 9px; padding: 3px;" />
          <span style="font-weight: 800; font-size: 17px; color: #ffffff;">Préstamos</span>
        </div>
        <ion-buttons slot="end">
          <ion-button (click)="theme.toggle()" title="Cambiar modo oscuro/claro">
            <ion-icon [name]="theme.isDark ? 'sunny-outline' : 'moon-outline'" style="color: #A7E0DB; font-size: 20px;"></ion-icon>
          </ion-button>
          <ion-button (click)="cargarPrestamos()" title="Actualizar">
            <ion-icon name="refresh-outline" style="color: #A7E0DB; font-size: 20px;"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="app-content">
      <ion-refresher slot="fixed" (ionRefresh)="refrescar($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div style="padding: 16px; max-width: 600px; margin: 0 auto;">

        <!-- Banner de Bienvenida (Similar al Panel General del Frontend Web) -->
        <div style="background: linear-gradient(135deg, #2A2F63 0%, #3E6D9C 55%, #5FB0C9 100%); border-radius: 22px; padding: 20px; color: #ffffff; box-shadow: 0 10px 24px rgba(42, 47, 99, 0.22); position: relative; overflow: hidden; margin-bottom: 16px;">
          <div style="position: absolute; right: -28px; bottom: -28px; width: 130px; height: 130px; border-radius: 50%; background: rgba(255, 255, 255, 0.12); pointer-events: none;"></div>
          <div style="position: relative; z-index: 2;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <img src="assets/Logo_BiblioTech.png" alt="BiblioTech"
                style="width: 38px; height: 38px; object-fit: contain; background: rgba(255,255,255,0.95); border-radius: 11px; padding: 4px;" />
              <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; background: rgba(255,255,255,0.18); padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.25);">
                Panel Móvil BiblioTech
              </span>
            </div>
            <h1 style="margin: 0 0 6px; font-size: 21px; font-weight: 800; letter-spacing: -0.3px;">
              Bienvenido, {{ usuario?.user || 'Invitado' }}
            </h1>
            <p style="margin: 0 0 14px; font-size: 12.5px; color: rgba(255, 255, 255, 0.88); line-height: 1.45;">
              Plataforma integral de gestión bibliotecaria: consulta tus préstamos activos, fechas de devolución y disponibilidad de ejemplares físicos en sala.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button type="button" (click)="irAEjemplares()"
                style="background: #ffffff; color: #2A2F63; border: none; border-radius: 10px; padding: 7px 12px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <ion-icon name="layers-outline" style="color: #3E6D9C;"></ion-icon>
                Consultar Ejemplares
              </button>
              <button type="button" (click)="irAPerfil()"
                style="background: rgba(255, 255, 255, 0.16); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.28); border-radius: 10px; padding: 7px 12px; font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <ion-icon name="person-circle-outline"></ion-icon>
                Mi Perfil
              </button>
            </div>
          </div>
        </div>

        <!-- Si no ha iniciado sesión -->
        <div *ngIf="!usuario" class="glass-card" style="padding: 24px; text-align: center;">
          <ion-icon name="lock-closed-outline" style="font-size: 42px; color: #3E6D9C; margin-bottom: 8px;"></ion-icon>
          <h3 class="card-title" style="margin: 0 0 6px; font-size: 16px; font-weight: 800; color: #2A2F63;">Inicie sesión para ver sus préstamos</h3>
          <p class="card-subtext" style="margin: 0 0 16px; font-size: 13px; color: #64748b;">
            Conéctese con su cuenta para consultar sus préstamos y ejemplares asociados.
          </p>
          <ion-button (click)="irALogin()" style="--border-radius: 10px; font-weight: 700;">
            <ion-icon name="log-in-outline" slot="start"></ion-icon> Iniciar Sesión
          </ion-button>
        </div>

        <ng-container *ngIf="usuario">
          <!-- Filtros de Estado (Todos | Por Devolver | Devueltos) -->
          <div style="display: flex; gap: 8px; margin-bottom: 14px;">
            <button type="button" (click)="cambiarFiltro('Todos')"
              class="filter-btn"
              [class.active-filter]="filtroEstado === 'Todos'"
              style="flex: 1; padding: 9px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
              Todos ({{ prestamos.length }})
            </button>
            <button type="button" (click)="cambiarFiltro('Pendientes')"
              class="filter-btn"
              [class.active-filter]="filtroEstado === 'Pendientes'"
              style="flex: 1; padding: 9px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
              Por Devolver
            </button>
            <button type="button" (click)="cambiarFiltro('Devueltos')"
              class="filter-btn"
              [class.active-filter]="filtroEstado === 'Devueltos'"
              style="flex: 1; padding: 9px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
              Devueltos
            </button>
          </div>

          <!-- Cargando -->
          <div *ngIf="cargando" style="text-align: center; padding: 36px;">
            <ion-spinner name="crescent" color="primary"></ion-spinner>
            <p class="card-subtext" style="font-size: 13px; color: #64748b; margin-top: 8px;">Consultando préstamos...</p>
          </div>

          <!-- Lista de Tarjetas de Préstamo -->
          <div *ngIf="!cargando" style="display: flex; flex-direction: column; gap: 12px;">
            <div *ngFor="let p of prestamosFiltrados" (click)="abrirDetalle(p)"
              class="glass-card" style="padding: 16px; cursor: pointer;">
              <div class="card-divider" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
                <span class="card-title" style="font-weight: 800; font-size: 15px; color: #2A2F63;">
                  Préstamo Cod. {{ p.codp }}
                </span>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <span class="badge-pill"
                    [style.background]="p.tipopres === 1 ? '#e0e7ff' : '#ccfbf1'"
                    [style.color]="p.tipopres === 1 ? '#4338ca' : '#0f766e'">
                    {{ p.tipopres === 1 ? 'Domicilio' : 'En Sala' }}
                  </span>
                  <span class="badge-pill"
                    [style.background]="tienePendientes(p) ? '#fef3c7' : '#d1fae5'"
                    [style.color]="tienePendientes(p) ? '#b45309' : '#047857'">
                    {{ tienePendientes(p) ? 'En Curso' : 'Devuelto' }}
                  </span>
                </div>
              </div>

              <!-- Fechas Importantes -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 10px;">
                <div class="info-box" style="background: #f8fafc; padding: 7px 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <span class="card-subtext" style="color: #64748b; font-weight: 600;">Inicio: </span>
                  <strong class="card-title" style="color: #1e293b;">{{ p.fini }}</strong>
                </div>
                <div class="info-box" style="background: #f8fafc; padding: 7px 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <span class="card-subtext" style="color: #64748b; font-weight: 600;">Fin: </span>
                  <strong class="card-title" style="color: #1e293b;">{{ p.ffin }}</strong>
                </div>
              </div>

              <!-- Resumen de Libros -->
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #5FB0C9; font-weight: 700;">
                <span>
                  <ion-icon name="book-outline" style="vertical-align: middle; margin-right: 4px;"></ion-icon>
                  {{ p.detalles.length || 0 }} ejemplar(es)
                </span>
                <span>Ver detalle &rarr;</span>
              </div>
            </div>

            <div *ngIf="prestamosFiltrados.length === 0" class="glass-card" style="padding: 28px; text-align: center; color: #64748b;">
              <ion-icon name="calendar-outline" style="font-size: 38px; color: #94a3b8; margin-bottom: 8px;"></ion-icon>
              <p class="card-subtext" style="margin: 0; font-size: 13px; font-weight: 600;">No se encontraron préstamos registrados.</p>
            </div>
          </div>
        </ng-container>
      </div>

      <!-- Modal Detalle de Libros del Préstamo -->
      <ion-modal [isOpen]="!!prestamoSeleccionado" (didDismiss)="prestamoSeleccionado = null">
        <ng-template>
          <div style="height: 100%; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; padding: 18px;">
            <div class="glass-card" style="padding: 22px; max-width: 440px; width: 100%; max-height: 85vh; overflow-y: auto;" *ngIf="prestamoSeleccionado">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #A7E0DB; padding-bottom: 10px; margin-bottom: 14px;">
                <h3 class="card-title" style="margin: 0; font-size: 17px; font-weight: 800; color: #2A2F63;">
                  Préstamo Cod. {{ prestamoSeleccionado.codp }}
                </h3>
                <button type="button" (click)="prestamoSeleccionado = null" style="background: transparent; border: none; font-size: 22px; color: #64748b; cursor: pointer;">
                  &times;
                </button>
              </div>

              <div class="info-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-size: 12px; color: #334155; margin-bottom: 14px; display: flex; flex-direction: column; gap: 4px;">
                <div><strong>Lector:</strong> {{ prestamoSeleccionado.estudianteNombre }}</div>
                <div><strong>Plazo:</strong> {{ prestamoSeleccionado.fini }} al {{ prestamoSeleccionado.ffin }}</div>
                <div><strong>Tipo:</strong> {{ prestamoSeleccionado.tipopres === 1 ? 'A Domicilio' : 'En Sala' }}</div>
              </div>

              <table class="app-table" style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden;">
                <thead>
                  <tr style="background: #A7E0DB; color: #2A2F63;">
                    <th style="padding: 8px; text-align: left; border-bottom: 2px solid #5FB0C9; border-right: 1px solid rgba(95,176,201,0.4);">Cod. Inv.</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 2px solid #5FB0C9; border-right: 1px solid rgba(95,176,201,0.4);">Título</th>
                    <th style="padding: 8px; text-align: center; border-bottom: 2px solid #5FB0C9;">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let d of prestamoSeleccionado.detalles" style="border-bottom: 1px solid #cbd5e1;">
                    <td style="padding: 8px; font-weight: 700; border-right: 1px solid #e2e8f0;">Cod. {{ d.codinv }}</td>
                    <td style="padding: 8px; font-weight: 600; border-right: 1px solid #e2e8f0;">{{ d.titulo }}</td>
                    <td style="padding: 8px; text-align: center;">
                      <span class="badge-pill"
                        [style.background]="d.estado === 1 ? '#fef3c7' : '#d1fae5'"
                        [style.color]="d.estado === 1 ? '#b45309' : '#047857'">
                        {{ d.estado === 1 ? 'Prestado' : 'Devuelto' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <ion-button expand="block" (click)="prestamoSeleccionado = null" style="margin-top: 16px; --border-radius: 10px; font-weight: 700;">
                Cerrar
              </ion-button>
            </div>
          </div>
        </ng-template>
      </ion-modal>
    </ion-content>
  `
})
export class PrestamosPage implements OnInit {
  private auth = inject(AuthService);
  private prestamoService = inject(PrestamoMovilService);
  private router = inject(Router);
  theme = inject(ThemeService);

  usuario: UserSession | null = null;
  prestamos: PrestamoMovil[] = [];
  prestamosFiltrados: PrestamoMovil[] = [];
  filtroEstado: 'Todos' | 'Pendientes' | 'Devueltos' = 'Todos';
  cargando = false;
  prestamoSeleccionado: PrestamoMovil | null = null;

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => {
      this.usuario = u;
      if (u && u.username) {
        this.cargarPrestamos();
      } else {
        this.prestamos = [];
        this.prestamosFiltrados = [];
      }
    });
  }

  cargarPrestamos(event?: any) {
    if (!this.usuario?.username) {
      if (event) event.target.complete();
      return;
    }
    this.cargando = !event;
    this.prestamoService.listarPorUsuario(this.usuario.username).subscribe({
      next: (data) => {
        this.prestamos = data || [];
        this.aplicarFiltro();
        this.cargando = false;
        if (event) event.target.complete();
      },
      error: () => {
        this.cargando = false;
        if (event) event.target.complete();
      }
    });
  }

  refrescar(event: any) {
    this.cargarPrestamos(event);
  }

  tienePendientes(p: PrestamoMovil): boolean {
    return p.estado === 1 && !!p.detalles && p.detalles.some(d => d.estado === 1);
  }

  cambiarFiltro(f: 'Todos' | 'Pendientes' | 'Devueltos') {
    this.filtroEstado = f;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.filtroEstado === 'Pendientes') {
      this.prestamosFiltrados = this.prestamos.filter(p => this.tienePendientes(p));
    } else if (this.filtroEstado === 'Devueltos') {
      this.prestamosFiltrados = this.prestamos.filter(p => !this.tienePendientes(p));
    } else {
      this.prestamosFiltrados = [...this.prestamos];
    }
  }

  abrirDetalle(p: PrestamoMovil) {
    this.prestamoSeleccionado = p;
  }

  irAEjemplares() {
    this.router.navigate(['/tabs/disponibilidad']);
  }

  irAPerfil() {
    this.router.navigate(['/tabs/perfil']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
