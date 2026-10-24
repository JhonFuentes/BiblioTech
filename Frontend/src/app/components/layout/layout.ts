import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { MenuService, Rol, Menu as MenuModel } from '../../services/menu.service';
import { Login } from '../login/login';
import { LucideAngularModule } from 'lucide-angular';

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
  private menuService = inject(MenuService);
  private router = inject(Router);
  
  usuario: any = null;
  fechaLiteral: string = '';
  showMenu: boolean = false;
  sidebarOpen: boolean = false;
  showLoginModal: boolean = false;
  saludos: string = '';

  // Roles & Menús dinámicos (B-1, B-2)
  roles: Rol[] = [];
  selectedRolId: number | null = null;
  menus: MenuModel[] = [];
  activeGroups: { [key: number]: boolean } = {};

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.usuario = user;
      if (this.usuario && this.usuario.fecha) {
        this.formatearFechaLiteral(this.usuario.fecha);
      } else {
        this.generarFechaLocal();
      }
      if (this.usuario && this.usuario.saludos) {
        this.saludos = this.usuario.saludos;
      } else {
        this.saludos = '';
      }
      this.cargarRolesYMenus();
    });
  }

  cargarRolesYMenus() {
    if (this.usuario && this.usuario.username) {
      this.menuService.getRolesUsuario(this.usuario.username).subscribe({
        next: (roles) => {
          this.roles = roles;
          if (roles.length > 0) {
            if (!this.selectedRolId || !roles.some(r => r.codr === this.selectedRolId)) {
              this.selectedRolId = roles[0].codr;
            }
            this.cargarMenusDelRol(this.selectedRolId);
          } else {
            this.menus = [];
          }
        },
        error: (err) => {
          console.error('Error al cargar roles de usuario', err);
          this.fallbackRoles();
        }
      });
    } else {
      this.fallbackRoles();
    }
  }

  fallbackRoles() {
    this.menuService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        if (roles.length > 0) {
          this.selectedRolId = roles[0].codr;
          this.cargarMenusDelRol(this.selectedRolId);
        } else {
          this.menuService.getAllMenus().subscribe(m => this.menus = m);
        }
      },
      error: () => {
        this.roles = [];
        this.menus = [];
      }
    });
  }

  onRolChange(event: any) {
    const codr = Number(event.target.value);
    this.selectedRolId = codr;
    this.cargarMenusDelRol(codr);
  }

  cargarMenusDelRol(codr: number) {
    this.menuService.getMenusPorRol(codr).subscribe({
      next: (menus) => {
        this.menus = menus;
        menus.forEach(m => {
          if (this.activeGroups[m.codm] === undefined) {
            this.activeGroups[m.codm] = true;
          }
        });
      },
      error: (err) => console.error('Error al cargar menús por rol', err)
    });
  }

  getMenuIcon(nombre: string): string {
    const n = (nombre || '').toLowerCase();
    if (n.includes('admin')) return 'layout-grid';
    if (n.includes('catálog') || n.includes('catalog') || n.includes('biblio')) return 'book-open';
    return 'box';
  }

  getProcesoIcon(enlace: string): string {
    const e = (enlace || '').toLowerCase();
    if (e.includes('usuario')) return 'users';
    if (e.includes('area')) return 'folder';
    if (e.includes('editorial')) return 'building';
    if (e.includes('tipo')) return 'layers';
    if (e.includes('autor')) return 'book';
    return 'chevron-right';
  }

  generarFechaLocal() {
    this.fechaLiteral = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatearFechaLiteral(fechaStr: string) {
    const parts = fechaStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      this.fechaLiteral = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else {
      this.generarFechaLocal();
    }
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
    return 'default.png';
  }

  openLogin() {
    this.showLoginModal = true;
    this.showMenu = false;
  }

  handleLoginClose(success: boolean) {
    this.showLoginModal = false;
    if (success) {
      this.cargarRolesYMenus();
    }
  }

  logout() {
    this.auth.logout();
    this.usuario = null;
    this.cargarRolesYMenus();
    this.router.navigate(['/']);
  }
}

