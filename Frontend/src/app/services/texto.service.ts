import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoTexto {
  codtipo: number;
  tipoNombre?: string;
  sw?: number;
  docum?: string;
}

export interface Texto {
  codt?: number;
  titulo: string;
  resumen?: string;
  isbn?: string;
  edicion?: number;
  fechapub?: string;
  coda: number;
  areaNombre?: string;
  code: number;
  editorialNombre?: string;
  estado?: number;
  autorIds?: number[];
  autoresNombres?: string[];
  tipos?: TipoTexto[];
}

@Injectable({
  providedIn: 'root'
})
export class TextoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/textos';

  listar(filtro?: string, coda?: number, code?: number, codtipo?: number, estado?: number): Observable<Texto[]> {
    let params = new HttpParams();
    if (filtro) params = params.set('filtro', filtro);
    if (coda) params = params.set('coda', coda);
    if (code) params = params.set('code', code);
    if (codtipo) params = params.set('codtipo', codtipo);
    if (estado !== undefined && estado !== -1) params = params.set('estado', estado);
    return this.http.get<Texto[]>(this.apiUrl, { params });
  }

  listarPaginado(page: number = 0, size: number = 15, filtro?: string, coda?: number, code?: number, codtipo?: number, estado?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filtro) params = params.set('filtro', filtro);
    if (coda) params = params.set('coda', coda);
    if (code) params = params.set('code', code);
    if (codtipo) params = params.set('codtipo', codtipo);
    if (estado !== undefined && estado !== -1) params = params.set('estado', estado);
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  obtenerPorId(id: number): Observable<Texto> {
    return this.http.get<Texto>(`${this.apiUrl}/${id}`);
  }

  crear(texto: Texto): Observable<Texto> {
    return this.http.post<Texto>(this.apiUrl, texto);
  }

  modificar(id: number, texto: Texto): Observable<Texto> {
    return this.http.put<Texto>(`${this.apiUrl}/${id}`, texto);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  habilitar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/activar`, {});
  }

  uploadDocumento(file: File): Observable<{ success: boolean; fileName: string; originalName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean; fileName: string; originalName: string }>(`${this.apiUrl}/uploadDocumento`, formData);
  }
}
