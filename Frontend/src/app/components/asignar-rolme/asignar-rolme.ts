import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolService, Rol } from '../../services/rol.service';
import { AsignacionService, AsignacionItem } from '../../services/asignacion.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-asignar-rolme',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './asignar-rolme.html'
})
export class AsignarRolme implements OnInit {
  private rolService = inject(RolService);
  private asignacionService = inject(AsignacionService);

  roles: Rol[] = [];
  rolesFiltrados: Rol[] = [];
  filtroRol = '';
  paginaRoles = 1;
  itemsPorPagina = 10;
  selectedRol: Rol | null = null;

  menus: AsignacionItem[] = [];
  menusFiltrados: AsignacionItem[] = [];
  filtroMenu = '';
  filtroAsignado = 'Todos'; // 'Todos' | 'SI' | 'NO'
  paginaMenus = 1;

  showConfirmDialog = false;
  dialogTipo: 'confirm' | 'aviso' | 'error' | 'success' = 'confirm';
  dialogSoloAceptar = true;
  confirmMensaje = '';

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.rolService.listar('', 1).subscribe({
      next: (data) => {
        this.roles = data.filter(r => r.estado === 1);
        this.filtrarRoles();
        if (this.rolesFiltrados.length > 0 && !this.selectedRol) {
          this.seleccionarRol(this.rolesFiltrados[0]);
        }
      },
      error: () => this.mostrarError('Error al cargar la lista de roles activos')
    });
  }

  filtrarRoles() {
    let temp = this.roles;
    if (this.filtroRol && this.filtroRol.trim()) {
      const q = this.filtroRol.toLowerCase().trim();
      temp = temp.filter(r => r.nombre.toLowerCase().includes(q));
    }
    this.rolesFiltrados = temp;
    this.paginaRoles = 1;
  }

  get rolesPaginados(): Rol[] {
    const start = (this.paginaRoles - 1) * this.itemsPorPagina;
    return this.rolesFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginasRoles(): number {
    return Math.max(1, Math.ceil(this.rolesFiltrados.length / this.itemsPorPagina));
  }

  seleccionarRol(r: Rol) {
    this.selectedRol = r;
    if (r.codr) {
      this.cargarMenus(r.codr);
    }
  }

  cargarMenus(codr: number) {
    this.asignacionService.listarMenusPorRol(codr).subscribe({
      next: (data) => {
        this.menus = data;
        this.filtrarMenus();
      },
      error: () => this.mostrarError('Error al cargar los menús del rol')
    });
  }

  filtrarMenus() {
    let temp = this.menus;
    if (this.filtroMenu && this.filtroMenu.trim()) {
      const q = this.filtroMenu.toLowerCase().trim();
      temp = temp.filter(m => m.nombre.toLowerCase().includes(q));
    }
    if (this.filtroAsignado === 'SI') {
      temp = temp.filter(m => m.asignado);
    } else if (this.filtroAsignado === 'NO') {
      temp = temp.filter(m => !m.asignado);
    }
    this.menusFiltrados = temp;
    this.paginaMenus = 1;
  }

  get menusPaginados(): AsignacionItem[] {
    const start = (this.paginaMenus - 1) * this.itemsPorPagina;
    return this.menusFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginasMenus(): number {
    return Math.max(1, Math.ceil(this.menusFiltrados.length / this.itemsPorPagina));
  }

  toggleMenu(m: AsignacionItem, event: Event) {
    if (!this.selectedRol || !this.selectedRol.codr) return;
    const checked = (event.target as HTMLInputElement).checked;
    const codm = Number(m.id);
    this.asignacionService.toggleRolMe(this.selectedRol.codr, codm, checked).subscribe({
      next: () => {
        m.asignado = checked;
        this.filtrarMenus();
      },
      error: (err) => {
        (event.target as HTMLInputElement).checked = !checked;
        this.mostrarError(err?.error?.message || 'No se pudo actualizar la asignación del menú');
      }
    });
  }

  mostrarError(mensaje: string) {
    this.dialogTipo = 'error';
    this.dialogSoloAceptar = true;
    this.confirmMensaje = mensaje;
    this.showConfirmDialog = true;
  }
}
