import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService, Menu } from '../../services/menu.service';
import { AsignacionService, AsignacionItem } from '../../services/asignacion.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-asignar-mepro',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './asignar-mepro.html'
})
export class AsignarMepro implements OnInit {
  private menuService = inject(MenuService);
  private asignacionService = inject(AsignacionService);

  menus: Menu[] = [];
  menusFiltrados: Menu[] = [];
  filtroMenu = '';
  paginaMenus = 1;
  itemsPorPagina = 10;
  selectedMenu: Menu | null = null;

  procesos: AsignacionItem[] = [];
  procesosFiltrados: AsignacionItem[] = [];
  filtroProceso = '';
  filtroAsignado = 'Todos'; // 'Todos' | 'SI' | 'NO'
  paginaProcesos = 1;

  showConfirmDialog = false;
  dialogTipo: 'confirm' | 'aviso' | 'error' | 'success' = 'confirm';
  dialogSoloAceptar = true;
  confirmMensaje = '';

  ngOnInit() {
    this.cargarMenus();
  }

  cargarMenus() {
    this.menuService.listarCrud('', 1).subscribe({
      next: (data) => {
        this.menus = data.filter(m => m.estado === 1);
        this.filtrarMenus();
        if (this.menusFiltrados.length > 0 && !this.selectedMenu) {
          this.seleccionarMenu(this.menusFiltrados[0]);
        }
      },
      error: () => this.mostrarError('Error al cargar la lista de menús activos')
    });
  }

  filtrarMenus() {
    let temp = this.menus;
    if (this.filtroMenu && this.filtroMenu.trim()) {
      const q = this.filtroMenu.toLowerCase().trim();
      temp = temp.filter(m => m.nombre.toLowerCase().includes(q));
    }
    this.menusFiltrados = temp;
    this.paginaMenus = 1;
  }

  get menusPaginados(): Menu[] {
    const start = (this.paginaMenus - 1) * this.itemsPorPagina;
    return this.menusFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginasMenus(): number {
    return Math.max(1, Math.ceil(this.menusFiltrados.length / this.itemsPorPagina));
  }

  seleccionarMenu(m: Menu) {
    this.selectedMenu = m;
    this.cargarProcesos(m.codm);
  }

  cargarProcesos(codm: number) {
    this.asignacionService.listarProcesosPorMenu(codm).subscribe({
      next: (data) => {
        this.procesos = data;
        this.filtrarProcesos();
      },
      error: () => this.mostrarError('Error al cargar los procesos del menú')
    });
  }

  filtrarProcesos() {
    let temp = this.procesos;
    if (this.filtroProceso && this.filtroProceso.trim()) {
      const q = this.filtroProceso.toLowerCase().trim();
      temp = temp.filter(p => p.nombre.toLowerCase().includes(q));
    }
    if (this.filtroAsignado === 'SI') {
      temp = temp.filter(p => p.asignado);
    } else if (this.filtroAsignado === 'NO') {
      temp = temp.filter(p => !p.asignado);
    }
    this.procesosFiltrados = temp;
    this.paginaProcesos = 1;
  }

  get procesosPaginados(): AsignacionItem[] {
    const start = (this.paginaProcesos - 1) * this.itemsPorPagina;
    return this.procesosFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginasProcesos(): number {
    return Math.max(1, Math.ceil(this.procesosFiltrados.length / this.itemsPorPagina));
  }

  toggleProceso(proc: AsignacionItem, event: Event) {
    if (!this.selectedMenu) return;
    const checked = (event.target as HTMLInputElement).checked;
    const codp = Number(proc.id);
    this.asignacionService.toggleMePro(this.selectedMenu.codm, codp, checked).subscribe({
      next: () => {
        proc.asignado = checked;
        this.filtrarProcesos();
      },
      error: (err) => {
        (event.target as HTMLInputElement).checked = !checked;
        this.mostrarError(err?.error?.message || 'No se pudo actualizar la asignación del proceso');
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
