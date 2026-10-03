import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Login } from '../login/login';
import { LucideAngularModule, Menu, ChevronDown, ChevronRight, User, LogOut, LogIn, Camera } from 'lucide-angular';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    Login, 
    LucideAngularModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  
  usuario: any = null;
  fechaLiteral: string = '';
  showMenu: boolean = false;
  activeGroups: { [key: number]: boolean } = { 1: true, 2: true };
  sidebarOpen: boolean = false;
  showLoginModal: boolean = false;

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.usuario = user;
      if (this.usuario && this.usuario.fecha) {
        this.formatearFechaLiteral(this.usuario.fecha);
      } else {
        this.generarFechaLocal();
      }
    });
  }

  generarFechaLocal() {
    this.fechaLiteral = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatearFechaLiteral(fechaStr: string) {
    const [day, month, year] = fechaStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    this.fechaLiteral = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  toggleUserMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleGroup(groupIndex: number) {
    this.activeGroups[groupIndex] = !this.activeGroups[groupIndex];
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getFotoUrl(): string {
    if (this.usuario && this.usuario.foto) {
      return `http://localhost:8080/fotos/${this.usuario.foto}`;
    }
    return 'https://ui-avatars.com/api/?name=' + (this.usuario?.user || 'U') + '&background=0D8ABC&color=fff';
  }

  openLogin() {
    this.showLoginModal = true;
    this.showMenu = false;
  }

  handleLoginClose(success: boolean) {
    this.showLoginModal = false;
  }

  logout() {
    this.auth.logout();
    this.usuario = null;
    this.router.navigate(['/']);
  }
}
