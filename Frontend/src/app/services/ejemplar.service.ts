import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ejemplar {
  codinv?: number;
  disponible?: number; // 1=Libre, 0=Ocupado
  estado?: number; // 1=Activo, 0=Anulado
  codt: number;
  tituloTexto?: string;
  per_resp?: string;
  per_anula?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EjemplarService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/ejemplares';

  listar(codt?: number, estado?: number): Observable<Ejemplar[]> {
    let params = new HttpParams();
    if (codt) params = params.set('codt', codt);
    if (estado !== undefined && estado !== -1) params = params.set('estado', estado);
    return this.http.get<Ejemplar[]>(this.apiUrl, { params });
  }

  listarPaginado(page: number = 0, size: number = 10, codt?: number, estado?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (codt) params = params.set('codt', codt);
    if (estado !== undefined && estado !== -1) params = params.set('estado', estado);
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  listarLibres(): Observable<Ejemplar[]> {
    return this.http.get<Ejemplar[]>(`${this.apiUrl}/libres`);
  }

  obtenerPorId(id: number): Observable<Ejemplar> {
    return this.http.get<Ejemplar>(`${this.apiUrl}/${id}`);
  }

  crear(ejemplar: Ejemplar): Observable<Ejemplar> {
    return this.http.post<Ejemplar>(this.apiUrl, ejemplar);
  }

  modificar(id: number, ejemplar: Ejemplar): Observable<Ejemplar> {
    return this.http.put<Ejemplar>(`${this.apiUrl}/${id}`, ejemplar);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  habilitar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/activar`, {});
  }
}
