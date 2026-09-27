import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService, Persona, Acceso } from '../../services/persona.service';
import { VentanaDialogo } from '../ventana-dialogo/ventana-dialogo';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, VentanaDialogo],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css']
})
export class GestionUsuarios implements OnInit {
  private personaService = inject(PersonaService);
  
  personas: Persona[] = [];
  personasFiltradas: Persona[] = [];
  filtroNombre = '';
  filtroEstado = 'Todos'; // Activos, Bajas, Todos
  paginaActual = 1;
  itemsPorPagina = 15;
  
  // Modals state
  showFormModal = false;
  showAccesoModal = false;
  showConfirmDialog = false;
  
  confirmMensaje = '';
  confirmAccion: () => void = () => {};
  
  editMode = false;
  currentPersona: Persona = this.getEmptyPersona();
  telefonosText = '';
  
  accesoData: Acceso = { login: '', password: '' };
  accesoEditMode = false;

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

  // ACCIONES PERSONA
  abrirAdicionar() {
    this.editMode = false;
    this.currentPersona = this.getEmptyPersona();
    this.telefonosText = '';
    this.showFormModal = true;
  }

  abrirModificar(p: Persona) {
    this.editMode = true;
    this.currentPersona = { ...p };
    this.telefonosText = p.telefonos ? p.telefonos.join(', ') : '';
    this.showFormModal = true;
  }

  guardarPersona() {
    this.currentPersona.telefonos = this.telefonosText.split(',').map(t => t.trim()).filter(t => t.length > 0);
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

  // ACCIONES ACCESO
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

  guardarAcceso() {
    this.confirmar('Seguro de Asignar/Modificar Acceso ?', () => {
      if (this.accesoEditMode) {
        this.personaService.modificarAcceso(this.currentPersona.codper!, this.accesoData).subscribe(() => {
          this.cargarPersonas();
          this.showAccesoModal = false;
        });
      } else {
        this.personaService.asignarAcceso(this.currentPersona.codper!, this.accesoData).subscribe(() => {
          this.cargarPersonas();
          this.showAccesoModal = false;
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
