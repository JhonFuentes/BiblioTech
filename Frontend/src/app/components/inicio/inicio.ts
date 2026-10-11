import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto font-sans flex flex-col items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-[#2A2F63] mb-2">Bienvenido a BiblioTech</h1>
      </div>
    </div>
  `
})
export class InicioComponent { }
