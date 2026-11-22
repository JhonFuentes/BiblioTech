import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login-movil',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <ion-content [fullscreen]="true">
      <div style="min-height: 100%; background: linear-gradient(155deg, #2A2F63 0%, #3E6D9C 52%, #5FB0C9 100%); display: flex; flex-direction: column; justify-content: center; padding: 24px; position: relative;">

        <!-- Botón Modo Oscuro / Claro superior derecho -->
        <button type="button" (click)="theme.toggle()" title="Cambiar tema"
          style="position: absolute; top: 18px; right: 18px; width: 42px; height: 42px; border-radius: 14px; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); color: #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px);">
          <ion-icon [name]="theme.isDark ? 'sunny-outline' : 'moon-outline'" style="font-size: 20px;"></ion-icon>
        </button>

        <!-- Encabezado de Marca con el Logo Oficial del Frontend Web -->
        <div style="text-align: center; color: #ffffff; margin-bottom: 24px;">
          <div style="width: 104px; height: 104px; border-radius: 26px; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; border: 2px solid #A7E0DB; box-shadow: 0 8px 24px rgba(0,0,0,0.2); padding: 10px;">
            <img src="assets/Logo_BiblioTech.png" alt="Logo BiblioTech" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">BiblioTech</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: rgba(227, 246, 245, 0.9);">
            Consulta tus préstamos y disponibilidad de ejemplares
          </p>
        </div>

        <!-- Tarjeta de Login -->
        <div class="glass-card" style="padding: 26px 22px; max-width: 400px; width: 100%; margin: 0 auto;">
          <h2 class="card-title" style="margin: 0 0 18px; font-size: 18px; font-weight: 800; color: #2A2F63; text-align: center; border-bottom: 2px solid #A7E0DB; padding-bottom: 10px;">
            Conexión al Sistema
          </h2>

          <div style="margin-bottom: 16px;">
            <label class="field-label" style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px;">
              Usuario <span class="required-star">*</span>
            </label>
            <div style="position: relative;">
              <ion-icon name="person-outline" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 18px;"></ion-icon>
              <input type="text" [(ngModel)]="login" (keyup.enter)="ingresar()"
                placeholder="Ingrese su usuario (ej. juan o admin)"
                class="app-input"
                style="width: 100%; padding: 11px 12px 11px 38px; border-radius: 12px; border: 1px solid #cbd5e1; font-size: 14px; color: #1e293b; background: #ffffff; outline: none; box-sizing: border-box;" />
            </div>
          </div>

          <div style="margin-bottom: 22px;">
            <label class="field-label" style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px;">
              Contraseña <span class="required-star">*</span>
            </label>
            <div style="position: relative;">
              <ion-icon name="lock-closed-outline" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 18px;"></ion-icon>
              <input type="password" [(ngModel)]="password" (keyup.enter)="ingresar()"
                placeholder="••••••••"
                class="app-input"
                style="width: 100%; padding: 11px 12px 11px 38px; border-radius: 12px; border: 1px solid #cbd5e1; font-size: 14px; color: #1e293b; background: #ffffff; outline: none; box-sizing: border-box;" />
            </div>
          </div>

          <ion-button expand="block" [disabled]="cargando" (click)="ingresar()" style="--border-radius: 12px; font-weight: 700; height: 46px;">
            <ion-spinner *ngIf="cargando" name="crescent" style="margin-right: 8px;"></ion-spinner>
            <ion-icon *ngIf="!cargando" name="log-in-outline" slot="start"></ion-icon>
            {{ cargando ? 'Verificando...' : 'Ingresar' }}
          </ion-button>
        </div>
      </div>

      <!-- Modal de Aviso / Error (Sin alert nativo) -->
      <ion-modal [isOpen]="showModal" (didDismiss)="showModal = false">
        <ng-template>
          <div style="height: 100%; background: rgba(42,47,99,0.45); display: flex; align-items: center; justify-content: center; padding: 24px;">
            <div class="glass-card" style="padding: 24px; max-width: 340px; width: 100%; text-align: center;">
              <div style="width: 54px; height: 54px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                <ion-icon name="alert-circle-outline" style="font-size: 30px;"></ion-icon>
              </div>
              <h3 class="card-title" style="margin: 0 0 8px; font-size: 17px; font-weight: 800; color: #2A2F63;">Aviso de Validación</h3>
              <p class="card-subtext" style="margin: 0 0 18px; font-size: 13px; color: #475569; line-height: 1.5;">{{ modalMensaje }}</p>
              <ion-button expand="block" (click)="showModal = false" style="--border-radius: 10px; font-weight: 700;">
                Aceptar
              </ion-button>
            </div>
          </div>
        </ng-template>
      </ion-modal>
    </ion-content>
  `
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  theme = inject(ThemeService);

  login = '';
  password = '';
  cargando = false;

  showModal = false;
  modalMensaje = '';

  ingresar() {
    if (!this.login.trim()) {
      this.mostrarAviso('Por favor ingrese su nombre de usuario.');
      return;
    }
    if (!this.password.trim()) {
      this.mostrarAviso('Por favor ingrese su contraseña.');
      return;
    }

    this.cargando = true;
    this.auth.login(this.login.trim(), this.password.trim()).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res && res.success) {
          this.router.navigate(['/tabs/prestamos']);
        } else {
          this.mostrarAviso(res?.message || 'Credenciales incorrectas.');
        }
      },
      error: (err) => {
        this.cargando = false;
        this.mostrarAviso(err?.error?.message || 'Usuario o contraseña incorrectos.');
      }
    });
  }

  mostrarAviso(msg: string) {
    this.modalMensaje = msg;
    this.showModal = true;
  }
}
