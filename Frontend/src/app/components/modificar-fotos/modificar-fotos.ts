import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-modificar-fotos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        
        <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-gray-700 font-medium">Modificar Foto..</h2>
          <div class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">1</div>
        </div>

        <div class="p-6">
          <div class="flex items-center gap-4 mb-6">
            <label class="text-sm font-medium text-gray-700 w-24">Nueva Foto:</label>
            <div class="flex-1">
              <input type="file" id="fotoFile" (change)="onFileSelected($event)" accept="image/*" class="hidden">
              <div class="flex gap-2">
                <input type="text" readonly [value]="selectedFileName" class="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 outline-none" placeholder="Seleccione una imagen...">
                <label for="fotoFile" class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-1 px-4 border border-gray-400 rounded shadow cursor-pointer transition">
                  Browse
                </label>
              </div>
            </div>
          </div>

          <div *ngIf="message" class="text-center text-sm font-medium mb-4" [ngClass]="isError ? 'text-red-600' : 'text-green-600'">
            {{ message }}
          </div>

          <div class="flex justify-center gap-6 mt-8">
            <button (click)="upload()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow transition">
              Modificar
            </button>
            <button (click)="cancel()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow transition">
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

  selectedFile: File | null = null;
  selectedFileName: string = '';
  message: string = '';
  isError: boolean = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
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
          // Agregar un timestamp para evitar que el navegador use la imagen cacheada anterior
          user.foto = res.foto + '?t=' + new Date().getTime();
          this.auth.updateUser(user);
          
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
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
    this.router.navigate(['/']);
  }
}
