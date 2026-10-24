import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Editorial {
  code?: number;
  nombre: string;
  estado?: number;
  nivel?:number;
}

@Injectable({
  providedIn: 'root'
})
export class EditorialService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/editoriales';

  listar(filtroNombre?: string, filtroEstado?: number): Observable<Editorial[]> {
    let params = new HttpParams();
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<Editorial[]>(this.apiUrl, { params });
  }

  listarPaginado(page: number = 0, size: number = 10, filtroNombre?: string, filtroEstado?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  crear(editorial: Editorial): Observable<Editorial> {
    return this.http.post<Editorial>(this.apiUrl, editorial);
  }

  modificar(code: number, editorial: Editorial): Observable<Editorial> {
    return this.http.put<Editorial>(`${this.apiUrl}/${code}`, editorial);
  }

  eliminar(code: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${code}`);
  }

  habilitar(code: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${code}/activar`, {});
  }
}
