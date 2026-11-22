import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { MenuService, Rol, Menu as MenuModel } from '../../services/menu.service';
import { Login } from '../login/login';
import { ModificarFotos } from '../modificar-fotos/modificar-fotos';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    Login,
    ModificarFotos,
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
  showFotoModal: boolean = false;
  saludos: string = '';

  // Roles & Menús dinámicos (B-1, B-2)
  roles: Rol[] = [];
  selectedRolId: number | null = null;
  menus: MenuModel[] = [];
  activeGroups: { [key: number]: boolean } = {};
  darkMode: boolean = false;

  ngOnInit() {
    this.darkMode = localStorage.getItem('bibliotech_web_theme') === 'dark';
    this.applyTheme();

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

    // Actualizar roles y menús en tiempo real sin recargar la página cuando cambian asignaciones (ROLUSU, ROLME, MEPRO) o catálogos
    this.menuService.menuChanges$.subscribe(() => {
      this.cargarRolesYMenus();
    });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('bibliotech_web_theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.classList.toggle('dark-theme', this.darkMode);
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  cargarRolesYMenus() {
    // B-2: Las cajas de opciones de menús se visualizan una vez que el usuario ingrese al sistema
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
            this.menuService.setActiveRolMenus(null, [], true);
            this.verificarAccesoRutaActual();
          }
        },
        error: (err) => {
          console.error('Error al cargar roles de usuario', err);
          this.roles = [];
          this.menus = [];
          this.menuService.setActiveRolMenus(null, [], true);
        }
      });
    } else {
      this.roles = [];
      this.selectedRolId = null;
      this.menus = [];
      this.menuService.setActiveRolMenus(null, [], true);
      this.verificarAccesoRutaActual();
    }
  }

  onRolChange(event: any) {
    const codr = Number(event.target.value);
    this.selectedRolId = codr;
    this.cargarMenusDelRol(codr);
  }

  cargarMenusDelRol(codr: number) {
    const rolActual = this.roles.find(r => r.codr === codr) || null;
    this.menuService.getMenusPorRol(codr).subscribe({
      next: (menus) => {
        // Filtrar cualquier proceso residual de catálogo digital eliminado
        const menusLimpios = (menus || []).map(m => ({
          ...m,
          procesos: (m.procesos || []).filter(p => !this.menuService.normalizarRuta(p.enlace).includes('catalogo-digital'))
        })).filter(m => m.procesos.length > 0);

        this.menus = menusLimpios;
        menusLimpios.forEach(m => {
          if (this.activeGroups[m.codm] === undefined) {
            this.activeGroups[m.codm] = true;
          }
        });
        this.menuService.setActiveRolMenus(rolActual, menusLimpios, true);
        this.verificarAccesoRutaActual();
      },
      error: (err) => console.error('Error al cargar menús por rol', err)
    });
  }

  private verificarAccesoRutaActual() {
    const currentUrl = this.router.url;
    if (!this.usuario || !this.menuService.isRutaPermitida(currentUrl)) {
      if (this.menuService.normalizarRuta(currentUrl) !== '' && this.menuService.normalizarRuta(currentUrl) !== 'inicio') {
        this.router.navigate(['/inicio']);
      }
    }
  }

  getMenuIcon(nombre: string): string {
    const n = (nombre || '').toLowerCase();
    if (n.includes('admin')) return 'layout-grid';
    if (n.includes('catálog') || n.includes('catalog') || n.includes('biblio')) return 'book-open';
    if (n.includes('préstam') || n.includes('prestam') || n.includes('devol')) return 'clipboard-list';
    return 'box';
  }

  getProcesoIcon(enlace: string): string {
    const e = (enlace || '').toLowerCase();
    if (e.includes('usuario')) return 'users';
    if (e.includes('rolusu')) return 'user-check';
    if (e.includes('rolme')) return 'shield-check';
    if (e.includes('mepro')) return 'sliders';
    if (e.includes('roles')) return 'shield';
    if (e.includes('menus')) return 'menu';
    if (e.includes('area')) return 'folder';
    if (e.includes('editorial')) return 'building';
    if (e.includes('tipo')) return 'layers';
    if (e.includes('autor')) return 'book';
    if (e.includes('texto')) return 'file-text';
    if (e.includes('ejemplar')) return 'archive';
    if (e.includes('digital')) return 'book-open';
    if (e.includes('prestamo')) return 'calendar';
    if (e.includes('devolucion')) return 'rotate-ccw';
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

  openModificarFoto() {
    this.showFotoModal = true;
    this.showMenu = false;
  }

  closeModificarFoto() {
    this.showFotoModal = false;
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

