import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService, Persona } from '../../services/persona.service';
import { AsignacionService, AsignacionItem } from '../../services/asignacion.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-asignar-rolusu',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './asignar-rolusu.html'
})
export class AsignarRolusu implements OnInit {
  private personaService = inject(PersonaService);
  private asignacionService = inject(AsignacionService);

  usuarios: Persona[] = [];
  usuariosFiltrados: Persona[] = [];
  filtroUsuario = '';
  paginaUsuarios = 1;
  itemsPorPagina = 10;
  selectedUsuario: Persona | null = null;

  roles: AsignacionItem[] = [];
  rolesFiltrados: AsignacionItem[] = [];
  filtroRol = '';
  filtroAsignado = 'Todos'; // 'Todos' | 'SI' | 'NO'
  paginaRoles = 1;

  showConfirmDialog = false;
  dialogTipo: 'confirm' | 'aviso' | 'error' | 'success' = 'confirm';
  dialogSoloAceptar = true;
  confirmMensaje = '';

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.personaService.listar().subscribe({
      next: (data) => {
        // B-19: Solo usuarios con credenciales asignadas y activos
        this.usuarios = data.filter(p => p.estado === 1 && p.hasLogin && p.login);
        this.filtrarUsuarios();
        if (this.usuariosFiltrados.length > 0 && !this.selectedUsuario) {
          this.seleccionarUsuario(this.usuariosFiltrados[0]);
        }
      },
      error: () => this.mostrarError('Error al cargar la lista de usuarios del sistema')
    });
  }

  filtrarUsuarios() {
    let temp = this.usuarios;
    if (this.filtroUsuario && this.filtroUsuario.trim()) {
      const q = this.filtroUsuario.toLowerCase().trim();
      temp = temp.filter(u =>
        `${u.nombre} ${u.ap || ''} ${u.am || ''} ${u.login || ''}`.toLowerCase().includes(q)
      );
    }
    this.usuariosFiltrados = temp;
    this.paginaUsuarios = 1;
  }

  get usuariosPaginados(): Persona[] {
    const start = (this.paginaUsuarios - 1) * this.itemsPorPagina;
    return this.usuariosFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginasUsuarios(): number {
    return Math.max(1, Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina));
  }

  seleccionarUsuario(u: Persona) {
    this.selectedUsuario = u;
    if (u.login) {
      this.cargarRoles(u.login);
    }
  }

  cargarRoles(login: string) {
    this.asignacionService.listarRolesPorUsuario(login).subscribe({
      next: (data) => {
        this.roles = data;
        this.filtrarRoles();
      },
      error: () => this.mostrarError('Error al cargar los roles del usuario')
    });
  }

  filtrarRoles() {
    let temp = this.roles;
    if (this.filtroRol && this.filtroRol.trim()) {
      const q = this.filtroRol.toLowerCase().trim();
      temp = temp.filter(r => r.nombre.toLowerCase().includes(q));
    }
    if (this.filtroAsignado === 'SI') {
      temp = temp.filter(r => r.asignado);
    } else if (this.filtroAsignado === 'NO') {
      temp = temp.filter(r => !r.asignado);
    }
    this.rolesFiltrados = temp;
    this.paginaRoles = 1;
  }

  get rolesPaginados(): AsignacionItem[] {
    const start = (this.paginaRoles - 1) * this.itemsPorPagina;
    return this.rolesFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginasRoles(): number {
    return Math.max(1, Math.ceil(this.rolesFiltrados.length / this.itemsPorPagina));
  }

  toggleRol(r: AsignacionItem, event: Event) {
    if (!this.selectedUsuario || !this.selectedUsuario.login) return;
    const checked = (event.target as HTMLInputElement).checked;
    const codr = Number(r.id);
    this.asignacionService.toggleRolUsu(this.selectedUsuario.login, codr, checked).subscribe({
      next: () => {
        r.asignado = checked;
        this.filtrarRoles();
      },
      error: (err) => {
        (event.target as HTMLInputElement).checked = !checked;
        this.mostrarError(err?.error?.message || 'No se pudo actualizar la asignación del rol');
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
