import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-modificar-fotos',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl w-11/12 max-w-md border border-white/50">
        
        <div class="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-[#E3F6F5] flex items-center justify-center text-[#3E6D9C]">
              <lucide-icon name="camera" class="w-5 h-5"></lucide-icon>
            </div>
            <h4 class="text-xl font-bold text-[#2A2F63] m-0">Modificar Foto</h4>
          </div>
          <button (click)="cancel()" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div>
          <div class="flex flex-col mb-6">
            <label class="text-sm font-semibold text-slate-600 mb-2">Nueva Foto: <span class="text-red-500 font-bold">*</span></label>
            <input type="file" id="fotoFile" (change)="onFileSelected($event)" accept=".jpg,.jpeg,.png,.webp" class="hidden">
            <div class="flex gap-2">
              <input type="text" readonly [value]="selectedFileName" class="flex-1 bg-white/90 border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none" placeholder="Seleccione una imagen...">
              <label for="fotoFile" class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm cursor-pointer transition flex items-center gap-1.5">
                <lucide-icon name="image" class="w-4 h-4 text-slate-500"></lucide-icon> Browse
              </label>
            </div>
          </div>

          <div *ngIf="message" class="text-center text-xs font-semibold mb-4 p-2.5 rounded-xl border"
               [ngClass]="isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'">
            {{ message }}
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button (click)="upload()" class="bg-[#3E6D9C] hover:bg-[#5FB0C9] text-white font-semibold text-sm py-2.5 px-6 rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              Modificar
            </button>
            <button (click)="cancel()" class="bg-slate-100/80 hover:bg-slate-200 border border-slate-300 text-slate-600 font-semibold text-sm py-2.5 px-6 rounded-xl transition-all cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class ModificarFotos {
  private auth = inject(Auth);
  private router = inject(Router);

  @Output() closeModal = new EventEmitter<void>();

  selectedFile: File | null = null;
  selectedFileName: string = '';
  message: string = '';
  isError: boolean = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isError = false;
      this.message = '';
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  upload() {
    if (!this.selectedFile) {
      this.isError = true;
      this.message = 'Debe seleccionar una foto.';
      return;
    }

    const user = this.auth.getUser();
    if (user && user.username) {
      this.auth.uploadFoto(user.username, this.selectedFile).subscribe({
        next: (res) => {
          this.isError = false;
          this.message = 'Foto modificada correctamente.';
          user.foto = res.foto + '?t=' + new Date().getTime();
          this.auth.updateUser(user);
          
          setTimeout(() => {
            this.cerrar();
          }, 900);
        },
        error: (err) => {
          this.isError = true;
          this.message = 'Error al subir la foto.';
          console.error(err);
        }
      });
    }
  }

  cancel() {
    this.cerrar();
  }

  private cerrar() {
    if (this.closeModal.observed) {
      this.closeModal.emit();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
