import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestamo } from './prestamo.service';

export interface Devolucion {
  codd?: number;
  fecha?: string;
  estado?: number;
  login?: string;
  codp: number;
  ci?: number;
  estudianteNombre?: string;
  fechaPrestamo?: string;
  ejemplaresIds: number[];
  ejemplaresTitulos?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DevolucionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/devoluciones';

  listarPrestamosPendientes(fechaInicio?: string, fechaFin?: string, filtroEstudiante?: string, codinv?: number, estadoPrestamo?: number): Observable<Prestamo[]> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    if (filtroEstudiante) params = params.set('filtroEstudiante', filtroEstudiante);
    if (codinv) params = params.set('codinv', codinv);
    if (estadoPrestamo !== undefined) params = params.set('estadoPrestamo', estadoPrestamo);
    return this.http.get<Prestamo[]>(`${this.apiUrl}/prestamos-pendientes`, { params });
  }

  listarPaginado(page: number = 0, size: number = 15, fechaInicio?: string, fechaFin?: string, filtroEstudiante?: string, estado?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    if (filtroEstudiante) params = params.set('filtroEstudiante', filtroEstudiante);
    if (estado !== undefined && estado !== -1) params = params.set('estado', estado);
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  registrarDevolucion(devolucion: Devolucion): Observable<Devolucion> {
    return this.http.post<Devolucion>(this.apiUrl, devolucion);
  }

  anularDevolucion(codd: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${codd}/anular`, {});
  }
}
