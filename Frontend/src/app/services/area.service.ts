import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Area {
  coda?: number;
  nombre: string;
  estado?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/areas';

  listar(filtroNombre?: string, filtroEstado?: number): Observable<Area[]> {
    let params = new HttpParams();
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<Area[]>(this.apiUrl, { params });
  }

  listarPaginado(page: number = 0, size: number = 10, filtroNombre?: string, filtroEstado?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  crear(area: Area): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, area);
  }

  modificar(coda: number, area: Area): Observable<Area> {
    return this.http.put<Area>(`${this.apiUrl}/${coda}`, area);
  }

  eliminar(coda: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${coda}`);
  }

  habilitar(coda: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${coda}/activar`, {});
  }
}
