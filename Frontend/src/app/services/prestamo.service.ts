import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetallePrestamo {
  codinv: number;
  titulo?: string;
  estado?: number;
}

export interface Prestamo {
  codp?: number;
  fecha?: string;
  fini: string;
  ffin: string;
  tipopres: number; // 1=Dom, 2=Sala
  estado?: number;
  ci: number;
  estudianteNombre?: string;
  login?: string;
  detalles: DetallePrestamo[];
}

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/prestamos';

  listar(fechaInicio?: string, fechaFin?: string, filtroEstudiante?: string, estado?: number): Observable<Prestamo[]> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    if (filtroEstudiante) params = params.set('filtroEstudiante', filtroEstudiante);
    if (estado !== undefined && estado !== -1) params = params.set('estado', estado);
    return this.http.get<Prestamo[]>(this.apiUrl, { params });
  }

  listarPaginado(page: number = 0, size: number = 15, fechaInicio?: string, fechaFin?: string, filtroEstudiante?: string, estado?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    if (filtroEstudiante) params = params.set('filtroEstudiante', filtroEstudiante);
    if (estado !== undefined && estado !== -1) params = params.set('estado', estado);
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  obtenerPorId(codp: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${codp}`);
  }

  crear(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, prestamo);
  }

  eliminar(codp: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${codp}`);
  }
}
