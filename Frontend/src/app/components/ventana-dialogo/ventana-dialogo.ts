import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ventana-dialogo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1060] transition-opacity" *ngIf="show">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-11/12 max-w-md shadow-2xl border border-white/50 transform transition-all translate-y-0 text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 border-4 border-blue-100 mb-6 shadow-sm">
          <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 class="text-xl font-bold text-[#2A2F63] mb-8">{{ mensaje }}</h4>
        <div class="flex justify-center gap-4">
          <button class="bg-[#3E6D9C] hover:bg-[#5FB0C9] text-white border-none py-2.5 px-8 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md hover:-translate-y-0.5" (click)="confirm.emit()">Aceptar</button>
          <button class="bg-slate-100/80 hover:bg-slate-200 border border-slate-300 text-slate-600 py-2.5 px-8 rounded-xl font-semibold cursor-pointer transition-all duration-200" (click)="cancel.emit()">Cancelar</button>
        </div>
      </div>
    </div>
  `
})
export class VentanaDialogo {
  @Input() show = false;
  @Input() mensaje = '¿Está seguro de realizar esta operación?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
