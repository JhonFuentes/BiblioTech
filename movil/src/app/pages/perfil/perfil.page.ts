import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService, UserSession, RolMovil } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-perfil-movil',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar style="--background: #2A2F63; --color: #ffffff; padding: 4px 8px;">
        <div slot="start" style="display: flex; align-items: center; gap: 10px; padding-left: 8px;">
          <img src="assets/Logo_BiblioTech.png" alt="Logo"
            style="width: 34px; height: 34px; object-fit: contain; background: #ffffff; border-radius: 9px; padding: 3px;" />
          <span style="font-weight: 800; font-size: 17px; color: #ffffff;">Mi Perfil</span>
        </div>
        <ion-buttons slot="end">
          <ion-button (click)="theme.toggle()" title="Cambiar modo oscuro/claro">
            <ion-icon [name]="theme.isDark ? 'sunny-outline' : 'moon-outline'" style="color: #A7E0DB; font-size: 20px;"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="app-content">
      <div style="padding: 18px; max-width: 500px; margin: 0 auto;">
        <div *ngIf="!usuario" class="glass-card" style="padding: 26px; text-align: center;">
          <ion-icon name="person-circle-outline" style="font-size: 56px; color: #3E6D9C;"></ion-icon>
          <h3 class="card-title" style="margin: 8px 0 6px; font-size: 17px; font-weight: 800; color: #2A2F63;">Sin sesión activa</h3>
          <p class="card-subtext" style="margin: 0 0 18px; font-size: 13px; color: #64748b;">
            Inicie sesión con su cuenta de BiblioTech para gestionar su perfil.
          </p>
          <ion-button expand="block" (click)="irALogin()" style="--border-radius: 12px; font-weight: 700;">
            <ion-icon name="log-in-outline" slot="start"></ion-icon> Iniciar Sesión
          </ion-button>
        </div>

        <div *ngIf="usuario" class="glass-card" style="padding: 24px; text-align: center;">
          <!-- Imagen de Perfil con Botón para Cambiar Foto -->
          <div style="position: relative; width: 100px; height: 100px; margin: 0 auto 12px;">
            <img [src]="getFoto(usuario.foto)" alt="Avatar"
              style="width: 100px; height: 100px; border-radius: 26px; object-fit: cover; border: 3px solid #A7E0DB; display: block; box-shadow: 0 4px 12px rgba(42,47,99,0.12);" />

            <input type="file" id="movilFotoInput" accept=".jpg,.jpeg,.png,.webp" (change)="onFotoSelected($event)" style="display: none;" />
            <label for="movilFotoInput" title="Cambiar foto de perfil"
              style="position: absolute; right: -4px; bottom: -4px; width: 34px; height: 34px; border-radius: 12px; background: #3E6D9C; color: #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
              <ion-icon name="camera-outline" style="font-size: 18px;"></ion-icon>
            </label>
          </div>

          <button type="button" (click)="triggerFileInput()"
            style="background: #E3F6F5; color: #2A2F63; border: 1px solid #A7E0DB; border-radius: 10px; padding: 6px 12px; font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 14px;">
            <ion-icon name="camera-outline"></ion-icon>
            {{ subiendoFoto ? 'Actualizando foto...' : 'Cambiar Imagen de Perfil' }}
          </button>

          <h2 class="card-title" style="margin: 0 0 16px; font-size: 19px; font-weight: 800; color: #2A2F63;">{{ usuario.user }}</h2>

          <!-- Datos Esenciales del Usuario -->
          <div class="info-box" style="text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; font-size: 13px; color: #334155; margin-bottom: 18px; display: flex; flex-direction: column; gap: 10px;">
            <div class="card-divider" style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              <span class="card-subtext" style="color: #64748b; font-weight: 600;">Usuario:</span>
              <strong class="card-title" style="color: #2A2F63;">{{ usuario.username }}</strong>
            </div>
            <div class="card-divider" style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              <span class="card-subtext" style="color: #64748b; font-weight: 600;">Cédula (CI):</span>
              <strong class="card-title" style="color: #2A2F63;">{{ usuario.cedula || 'N/A' }}</strong>
            </div>
            <div class="card-divider" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              <span class="card-subtext" style="color: #64748b; font-weight: 600;">Apariencia:</span>
              <button type="button" (click)="theme.toggle()"
                style="background: #3E6D9C; color: #ffffff; border: none; border-radius: 8px; padding: 5px 10px; font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                <ion-icon [name]="theme.isDark ? 'sunny-outline' : 'moon-outline'"></ion-icon>
                {{ theme.isDark ? 'Modo Claro' : 'Modo Oscuro' }}
              </button>
            </div>
            <div>
              <span class="card-subtext" style="color: #64748b; font-weight: 600; display: block; margin-bottom: 6px;">Rol(es):</span>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                <span *ngFor="let r of roles" class="badge-pill" style="background: #E3F6F5; color: #2A2F63; border: 1px solid #A7E0DB;">
                  <ion-icon name="shield-checkmark-outline"></ion-icon> {{ r.nombre }}
                </span>
                <span *ngIf="roles.length === 0" class="card-subtext" style="font-size: 12px; color: #94a3b8;">Lector / Estudiante</span>
              </div>
            </div>
          </div>

          <ion-button expand="block" color="danger" (click)="showConfirmLogout = true" style="--border-radius: 12px; font-weight: 700;">
            <ion-icon name="log-out-outline" slot="start"></ion-icon> Cerrar Sesión
          </ion-button>
        </div>
      </div>

      <!-- Modal de Aviso (Foto actualizada / Error) -->
      <ion-modal [isOpen]="showAvisoModal" (didDismiss)="showAvisoModal = false">
        <ng-template>
          <div style="height: 100%; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; padding: 24px;">
            <div class="glass-card" style="padding: 24px; max-width: 340px; width: 100%; text-align: center;">
              <h3 class="card-title" style="margin: 0 0 8px; font-size: 17px; font-weight: 800; color: #2A2F63;">Perfil de Usuario</h3>
              <p class="card-subtext" style="margin: 0 0 18px; font-size: 13px; color: #475569;">{{ avisoMensaje }}</p>
              <ion-button expand="block" (click)="showAvisoModal = false" style="--border-radius: 10px; font-weight: 700;">Aceptar</ion-button>
            </div>
          </div>
        </ng-template>
      </ion-modal>

      <!-- Modal Confirmar Cierre de Sesión -->
      <ion-modal [isOpen]="showConfirmLogout" (didDismiss)="showConfirmLogout = false">
        <ng-template>
          <div style="height: 100%; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; padding: 24px;">
            <div class="glass-card" style="padding: 24px; max-width: 340px; width: 100%; text-align: center;">
              <h3 class="card-title" style="margin: 0 0 8px; font-size: 17px; font-weight: 800; color: #2A2F63;">¿Cerrar Sesión?</h3>
              <p class="card-subtext" style="margin: 0 0 18px; font-size: 13px; color: #475569;">¿Está seguro de desconectarse de BiblioTech Móvil?</p>
              <div style="display: flex; gap: 10px;">
                <ion-button expand="block" fill="outline" style="flex: 1;" (click)="showConfirmLogout = false">Cancelar</ion-button>
                <ion-button expand="block" color="danger" style="flex: 1;" (click)="confirmarLogout()">Salir</ion-button>
              </div>
            </div>
          </div>
        </ng-template>
      </ion-modal>
    </ion-content>
  `
})
export class PerfilPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  theme = inject(ThemeService);

  usuario: UserSession | null = null;
  roles: RolMovil[] = [];
  showConfirmLogout = false;
  subiendoFoto = false;
  showAvisoModal = false;
  avisoMensaje = '';

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => {
      this.usuario = u;
      if (u && u.username) {
        this.auth.getRolesUsuario(u.username).subscribe({
          next: (r) => this.roles = r || [],
          error: () => this.roles = []
        });
      } else {
        this.roles = [];
      }
    });
  }

  getFoto(foto?: string): string {
    return this.auth.getFotoUrl(foto);
  }

  triggerFileInput() {
    const el = document.getElementById('movilFotoInput') as HTMLInputElement | null;
    if (el) el.click();
  }

  onFotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.usuario?.username) return;

    this.subiendoFoto = true;
    this.auth.uploadFotoPerfil(file, this.usuario.username).subscribe({
      next: () => {
        this.subiendoFoto = false;
        this.avisoMensaje = 'La imagen de perfil se actualizó correctamente.';
        this.showAvisoModal = true;
      },
      error: (err) => {
        this.subiendoFoto = false;
        this.avisoMensaje = err?.error?.message || 'No se pudo actualizar la imagen de perfil.';
        this.showAvisoModal = true;
      }
    });
  }

  confirmarLogout() {
    this.showConfirmLogout = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
