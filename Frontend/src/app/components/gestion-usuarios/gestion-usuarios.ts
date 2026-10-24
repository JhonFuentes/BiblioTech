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
  dialogTipo: 'confirm' | 'aviso' | 'error' | 'success' = 'confirm';
  dialogSoloAceptar = false;
  showVerModal = false;
  personaAver: Persona | null = null;

  confirmMensaje = '';
  confirmAccion: () => void = () => { };

  editMode = false;
  currentPersona: Persona = this.getEmptyPersona();
  nuevoTelefono = '';
  selectedFotoNombre = '';

  accesoData: Acceso = { login: '', password: '' };
  repetirPassword = '';
  accesoEditMode = false;
  menuAccionesAbierto: number | string | null = null;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.menuAccionesAbierto = null;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.ajustarItemsPorPagina();
  }

  ajustarItemsPorPagina() {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) {
        this.itemsPorPagina = 5; // Móvil: 5 filas
      } else if (width < 1024) {
        this.itemsPorPagina = 10; // Tablet: 10 filas
      } else {
        this.itemsPorPagina = 15; // Escritorio: 15 filas
      }
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = Math.max(1, this.totalPaginas);
      }
    }
  }

  mostrarAviso(mensaje: string) {
    this.dialogTipo = 'aviso';
    this.dialogSoloAceptar = true;
    this.confirmMensaje = mensaje;
    this.confirmAccion = () => { this.showConfirmDialog = false; };
    this.showConfirmDialog = true;
  }

  mostrarError(mensaje: string) {
    this.dialogTipo = 'error';
    this.dialogSoloAceptar = true;
    this.confirmMensaje = mensaje;
    this.confirmAccion = () => { this.showConfirmDialog = false; };
    this.showConfirmDialog = true;
  }

  confirmar(mensaje: string, accion: () => void) {
    this.dialogTipo = 'confirm';
    this.dialogSoloAceptar = false;
    this.confirmMensaje = mensaje;
    this.confirmAccion = accion;
    this.showConfirmDialog = true;
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
    this.ajustarItemsPorPagina();
    this.cargarPersonas();
  }

  cargarPersonas() {
    this.personaService.listar().subscribe({
      next: (data) => {
        this.personas = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar personas', err)
    });
  }

  aplicarFiltros() {
    let temp = this.personas;
    if (this.filtroNombre && this.filtroNombre.trim()) {
      const q = this.filtroNombre.toLowerCase().trim();
      temp = temp.filter(p => {
        const full = `${p.nombre || ''} ${p.ap || ''} ${p.am || ''} ${p.ap || ''} ${p.am || ''} ${p.nombre || ''}`.toLowerCase();
        return full.includes(q);
      });
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

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.personasFiltradas.length / this.itemsPorPagina));
  }

  getFotoUrl(p: Persona): string {
    if (p && p.foto) {
      return `http://localhost:8080/fotos/${p.foto}`;
    }
    return 'default.png';
  }

  abrirAdicionar() {
    this.editMode = false;
    this.currentPersona = this.getEmptyPersona();
    this.nuevoTelefono = '';
    this.selectedFotoNombre = '';
    this.showFormModal = true;
  }

  abrirModificar(p: Persona) {
    this.editMode = true;
    this.currentPersona = { ...p };
    this.currentPersona.telefonos = p.telefonos ? [...p.telefonos] : [];
    this.nuevoTelefono = '';
    this.selectedFotoNombre = p.foto || '';
    this.showFormModal = true;
  }

  onFotoSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFotoNombre = file.name;
      this.currentPersona.foto = file.name;
    }
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
    if (!this.currentPersona.nombre || !this.currentPersona.nombre.trim()) {
      this.mostrarAviso('Por favor ingrese el nombre de la persona');
      return;
    }

    const mensaje = this.editMode 
      ? '¿Seguro de Modificar Datos de la Persona?' 
      : '¿Seguro de Guardar Datos de la Persona?';

    this.confirmar(mensaje, () => {
      if (this.editMode && this.currentPersona.codper) {
        this.personaService.modificar(this.currentPersona.codper, this.currentPersona).subscribe({
          next: () => {
            this.cargarPersonas();
            this.showFormModal = false;
          },
          error: (err) => this.mostrarError(err?.error?.message || 'Error al modificar persona')
        });
      } else {
        this.personaService.crear(this.currentPersona).subscribe({
          next: () => {
            this.cargarPersonas();
            this.showFormModal = false;
          },
          error: (err) => this.mostrarError(err?.error?.message || 'Error al guardar persona')
        });
      }
    });
  }

  eliminar(p: Persona) {
    this.confirmar('¿Seguro de Eliminar Datos de la Persona?', () => {
      this.personaService.eliminar(p.codper!).subscribe({
        next: () => this.cargarPersonas(),
        error: (err) => this.mostrarError(err?.error?.message || 'Error al dar de baja persona')
      });
    });
  }

  habilitar(p: Persona) {
    this.confirmar('¿Seguro de Habilitar a la Persona?', () => {
      this.personaService.activar(p.codper!).subscribe({
        next: () => this.cargarPersonas(),
        error: (err) => this.mostrarError(err?.error?.message || 'Error al habilitar persona')
      });
    });
  }

  abrirAsignarAcceso(p: Persona) {
    this.currentPersona = p;
    this.accesoEditMode = false;
    this.accesoData = { login: '', password: '' };
    this.repetirPassword = '';
    this.showAccesoModal = true;
  }

  abrirModificarAcceso(p: Persona) {
    this.currentPersona = p;
    this.accesoEditMode = true;
    this.accesoData = { login: p.login || '', password: '' };
    this.repetirPassword = '';
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
    if (!this.accesoEditMode && (!this.accesoData.login || !this.accesoData.login.trim())) {
      this.mostrarAviso('Por favor ingrese el nombre de usuario');
      return;
    }
    if (!this.accesoData.password) {
      this.mostrarAviso('Por favor ingrese la contraseña');
      return;
    }
    if (this.accesoData.password !== this.repetirPassword) {
      this.mostrarAviso('Las contraseñas no coinciden. Por favor verifique.');
      return;
    }

    const mensaje = this.accesoEditMode 
      ? '¿Seguro de Modificar Datos de Acceso?' 
      : '¿Seguro de Asignar Datos de Acceso?';

    this.confirmar(mensaje, () => {
      if (this.accesoEditMode) {
        this.personaService.modificarAcceso(this.currentPersona.codper!, this.accesoData).subscribe({
          next: () => {
            this.cargarPersonas();
            this.showAccesoModal = false;
          },
          error: (err) => this.mostrarError(err?.error?.message || 'Error al modificar acceso')
        });
      } else {
        this.personaService.asignarAcceso(this.currentPersona.codper!, this.accesoData).subscribe({
          next: () => {
            this.cargarPersonas();
            this.showAccesoModal = false;
          },
          error: (err) => this.mostrarError(err?.error?.message || 'Error al asignar acceso')
        });
      }
    });
  }

  onConfirmDialog() {
    this.showConfirmDialog = false;
    this.confirmAccion();
  }

  onCancelDialog() {
    this.showConfirmDialog = false;
  }
}
