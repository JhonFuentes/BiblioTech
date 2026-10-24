import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tipo {
  codtipo?: number;
  nombre: string;
  estado?: number;
  sw: number; // 1 = Sube libro digital ("Con Documento"), 0 = Por defecto
}

@Injectable({
  providedIn: 'root'
})
export class TipoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tipos';

  listar(filtroNombre?: string, filtroEstado?: number): Observable<Tipo[]> {
    let params = new HttpParams();
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<Tipo[]>(this.apiUrl, { params });
  }

  listarPaginado(page: number = 0, size: number = 10, filtroNombre?: string, filtroEstado?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  crear(tipo: Tipo): Observable<Tipo> {
    return this.http.post<Tipo>(this.apiUrl, tipo);
  }

  modificar(codtipo: number, tipo: Tipo): Observable<Tipo> {
    return this.http.put<Tipo>(`${this.apiUrl}/${codtipo}`, tipo);
  }

  eliminar(codtipo: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${codtipo}`);
  }

  habilitar(codtipo: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${codtipo}/activar`, {});
  }
}
