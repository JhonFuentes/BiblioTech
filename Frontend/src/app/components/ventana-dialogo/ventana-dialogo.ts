import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ventana-dialogo',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1060] p-4 transition-opacity" *ngIf="show">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-11/12 max-w-md shadow-2xl border border-white/50 transform transition-all translate-y-0 text-center">
        
        <!-- Icono según el tipo de diálogo usando Lucide Icons -->
        <div *ngIf="tipo === 'confirm'" class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#E3F6F5] border-4 border-[#A7E0DB]/50 mb-6 shadow-sm">
          <lucide-icon name="alert-circle" class="h-8 w-8 text-[#3E6D9C]"></lucide-icon>
        </div>

        <div *ngIf="tipo === 'aviso'" class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 border-4 border-amber-100 mb-6 shadow-sm">
          <lucide-icon name="alert-circle" class="h-8 w-8 text-amber-500"></lucide-icon>
        </div>

        <div *ngIf="tipo === 'error'" class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 border-4 border-red-100 mb-6 shadow-sm">
          <lucide-icon name="x" class="h-8 w-8 text-red-500"></lucide-icon>
        </div>

        <div *ngIf="tipo === 'success'" class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border-4 border-emerald-100 mb-6 shadow-sm">
          <lucide-icon name="check-circle" class="h-8 w-8 text-emerald-500"></lucide-icon>
        </div>

        <h4 class="text-xl font-bold text-[#2A2F63] mb-8">{{ mensaje }}</h4>

        <div class="flex justify-center gap-4">
          <button class="bg-[#3E6D9C] hover:bg-[#5FB0C9] text-white border-none py-2.5 px-8 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md hover:-translate-y-0.5 flex items-center gap-2" 
                  (click)="confirm.emit()">
            <lucide-icon name="check" class="w-4 h-4"></lucide-icon>
            {{ textoAceptar }}
          </button>
          
          <button *ngIf="!soloAceptar && tipo === 'confirm'" 
                  class="bg-slate-100/80 hover:bg-slate-200 border border-slate-300 text-slate-600 py-2.5 px-8 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 flex items-center gap-2" 
                  (click)="cancel.emit()">
            <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
            {{ textoCancelar }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class VentanaDialogo {
  @Input() show = false;
  @Input()
  set isOpen(val: boolean) {
    this.show = val;
  }
  get isOpen(): boolean {
    return this.show;
  }
  @Input() tipo: 'confirm' | 'aviso' | 'error' | 'success' = 'confirm';
  @Input() soloAceptar = false;
  @Input() mensaje = '¿Está seguro de realizar esta operación?';
  @Input() textoAceptar = 'Aceptar';
  @Input() textoCancelar = 'Cancelar';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
