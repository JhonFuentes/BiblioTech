import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DetallePrestamoMovil {
  codinv: number;
  titulo: string;
  estado: number; // 1 = Prestado, 0 = Devuelto
}

export interface PrestamoMovil {
  codp: number;
  fecha: string;
  fini: string;
  ffin: string;
  tipopres: number; // 1 = A Domicilio, 2 = En Sala
  estado: number;   // 1 = Activo, 0 = Anulado
  ci: number;
  estudianteNombre: string;
  login: string;
  detalles: DetallePrestamoMovil[];
}

@Injectable({
  providedIn: 'root'
})
export class PrestamoMovilService {
  private http = inject(HttpClient);

  /**
   * Sección 8.1 del PDF: Listar préstamos asociados a un usuario con su detalle de libros
   */
  listarPorUsuario(login: string): Observable<PrestamoMovil[]> {
    return this.http.get<PrestamoMovil[]>(`${environment.apiUrl}/prestamos/usuario/${login}`);
  }

  /**
   * Listar todos los préstamos (para bibliotecarios / administradores)
   */
  listarTodos(): Observable<PrestamoMovil[]> {
    return this.http.get<PrestamoMovil[]>(`${environment.apiUrl}/prestamos`);
  }

  obtenerPorId(codp: number): Observable<PrestamoMovil> {
    return this.http.get<PrestamoMovil>(`${environment.apiUrl}/prestamos/${codp}`);
  }
}

