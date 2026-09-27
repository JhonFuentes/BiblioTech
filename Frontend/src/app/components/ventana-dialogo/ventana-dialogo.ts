import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ventana-dialogo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="show">
      <div class="modal-content text-center">
        <h4 class="mb-4">{{ mensaje }}</h4>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-primary" (click)="confirm.emit()">Aceptar</button>
          <button class="btn btn-secondary" (click)="cancel.emit()">Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
      z-index: 1050;
    }
    .modal-content {
      background: white; padding: 2rem; border-radius: 8px; max-width: 400px; width: 100%;
    }
  `]
})
export class VentanaDialogo {
  @Input() show = false;
  @Input() mensaje = '¿Está seguro de realizar esta operación?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
