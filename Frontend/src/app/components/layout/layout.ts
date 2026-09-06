import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  
  usuario: any = null;
  fechaLiteral: string = '';

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.usuario = this.auth.getUser();
      this.fechaLiteral = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
