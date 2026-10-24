import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Autor {
  coda?: number;
  nombre: string;
  ap?: string;
  am?: string;
  genero: string; // 'M' | 'F'
  estado?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/autores';

  listar(filtroNombre?: string, filtroEstado?: number): Observable<Autor[]> {
    let params = new HttpParams();
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<Autor[]>(this.apiUrl, { params });
  }

  listarPaginado(page: number = 0, size: number = 15, filtroNombre?: string, filtroEstado?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  crear(autor: Autor): Observable<Autor> {
    return this.http.post<Autor>(this.apiUrl, autor);
  }

  modificar(coda: number, autor: Autor): Observable<Autor> {
    return this.http.put<Autor>(`${this.apiUrl}/${coda}`, autor);
  }

  eliminar(coda: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${coda}`);
  }

  habilitar(coda: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${coda}/activar`, {});
  }
}
