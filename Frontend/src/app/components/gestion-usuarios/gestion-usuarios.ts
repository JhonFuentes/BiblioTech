import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService, Persona, Acceso } from '../../services/persona.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo, LucideAngularModule],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css']
})
export class GestionUsuarios implements OnInit {
  private personaService = inject(PersonaService);

  personas: Persona[] = [];
  personasFiltradas: Persona[] = [];
  filtroNombre = '';
  filtroEstado = 'Todos';
  filtroTipoPer = 'Todos';
  paginaActual = 1;
  itemsPorPagina = 15;


  showFormModal = false;
  showAccesoModal = false;
  showConfirmDialog = false;
  showVerModal = false;
  personaAver: Persona | null = null;

  confirmMensaje = '';
  confirmAccion: () => void = () => { };

  editMode = false;
  currentPersona: Persona = this.getEmptyPersona();
  nuevoTelefono = '';

  accesoData: Acceso = { login: '', password: '' };
  accesoEditMode = false;
  menuAccionesAbierto: number | string | null = null;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.menuAccionesAbierto = null;
  }

  toggleMenuAcciones(p: Persona, event: Event) {
    event.stopPropagation();
    if (this.menuAccionesAbierto === p.codper) {
      this.menuAccionesAbierto = null;
    } else {
      this.menuAccionesAbierto = p.codper || null;
    }
  }

  cerrarMenuAcciones() {
    this.menuAccionesAbierto = null;
  }

  ngOnInit() {
    this.cargarPersonas();
  }

  cargarPersonas() {
    this.personaService.listar().subscribe(data => {
      this.personas = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    let temp = this.personas;
    if (this.filtroNombre) {
      const q = this.filtroNombre.toLowerCase();
      temp = temp.filter(p => (p.nombre + ' ' + p.ap + ' ' + p.am).toLowerCase().includes(q));
    }
    if (this.filtroEstado === 'Activos') {
      temp = temp.filter(p => p.estado === 1);
    } else if (this.filtroEstado === 'Bajas') {
      temp = temp.filter(p => p.estado === 0);
    }
    if (this.filtroTipoPer !== 'Todos') {
      temp = temp.filter(p => p.tipoper === this.filtroTipoPer);
    }
    this.personasFiltradas = temp;
    this.paginaActual = 1;
  }

  getEmptyPersona(): Persona {
    return { nombre: '', ap: '', am: '', genero: 'M', tipoper: 'A', telefonos: [] };
  }

  get personasPaginadas() {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.personasFiltradas.slice(start, start + this.itemsPorPagina);
  }

  getFotoUrl(p: Persona): string {
    if (p.foto) {
      return `http://localhost:8080/fotos/${p.foto}`;
    }
    return 'default.png';
  }

  abrirAdicionar() {
    this.editMode = false;
    this.currentPersona = this.getEmptyPersona();
    this.nuevoTelefono = '';
    this.showFormModal = true;
  }

  abrirModificar(p: Persona) {
    this.editMode = true;
    this.currentPersona = { ...p };
    this.currentPersona.telefonos = p.telefonos ? [...p.telefonos] : [];
    this.nuevoTelefono = '';
    this.showFormModal = true;
  }

  agregarTelefono() {
    const telStr = String(this.nuevoTelefono || '').trim();
    if (telStr) {
      if (!this.currentPersona.telefonos) this.currentPersona.telefonos = [];
      this.currentPersona.telefonos.push(telStr);
      this.nuevoTelefono = '';
    }
  }

  eliminarTelefono(index: number) {
    if (this.currentPersona.telefonos) {
      this.currentPersona.telefonos.splice(index, 1);
    }
  }

  guardarPersona() {
    this.confirmar('Seguro de Guardar Datos de la Persona ?', () => {
      if (this.editMode && this.currentPersona.codper) {
        this.personaService.modificar(this.currentPersona.codper, this.currentPersona).subscribe(() => {
          this.cargarPersonas();
          this.showFormModal = false;
        });
      } else {
        this.personaService.crear(this.currentPersona).subscribe(() => {
          this.cargarPersonas();
          this.showFormModal = false;
        });
      }
    });
  }

  eliminar(p: Persona) {
    this.confirmar('Seguro de Eliminar Datos de la Persona ?', () => {
      this.personaService.eliminar(p.codper!).subscribe(() => this.cargarPersonas());
    });
  }

  habilitar(p: Persona) {
    this.confirmar('Seguro de Habilitar a la Persona ?', () => {
      this.personaService.activar(p.codper!).subscribe(() => this.cargarPersonas());
    });
  }

  abrirAsignarAcceso(p: Persona) {
    this.currentPersona = p;
    this.accesoEditMode = false;
    this.accesoData = { login: '', password: '' };
    this.showAccesoModal = true;
  }

  abrirModificarAcceso(p: Persona) {
    this.currentPersona = p;
    this.accesoEditMode = true;
    this.accesoData = { login: p.login || '', password: '' };
    this.showAccesoModal = true;
  }

  abrirVer(p: Persona) {
    this.personaAver = p;
    this.showVerModal = true;
  }

  imprimirVista() {
    window.print();
  }

  guardarAcceso() {
    this.confirmar('Seguro de Asignar/Modificar Acceso ?', () => {
      if (this.accesoEditMode) {
        this.personaService.modificarAcceso(this.currentPersona.codper!, this.accesoData).subscribe({
          next: () => {
            this.cargarPersonas();
            this.showAccesoModal = false;
          },
          error: (err) => alert(err.error.message || 'Error al modificar acceso')
        });
      } else {
        this.personaService.asignarAcceso(this.currentPersona.codper!, this.accesoData).subscribe({
          next: () => {
            this.cargarPersonas();
            this.showAccesoModal = false;
          },
          error: (err) => alert(err.error.message || 'Error al asignar acceso')
        });
      }
    });
  }

  confirmar(mensaje: string, accion: () => void) {
    this.confirmMensaje = mensaje;
    this.confirmAccion = accion;
    this.showConfirmDialog = true;
  }

  onConfirmDialog() {
    this.showConfirmDialog = false;
    this.confirmAccion();
  }

  onCancelDialog() {
    this.showConfirmDialog = false;
  }
}
