import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Texto } from './texto.service';

export interface CatalogoDigitalResponse {
  total: number;
  items: Texto[];
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoDigitalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/catalogo-digital';

  buscar(query?: string, coda?: number, code?: number, codtipo?: number, titulo?: string, autor?: string): Observable<CatalogoDigitalResponse> {
    let params = new HttpParams();
    if (query) params = params.set('query', query);
    if (titulo) params = params.set('titulo', titulo);
    if (autor) params = params.set('autor', autor);
    if (coda) params = params.set('coda', coda);
    if (code) params = params.set('code', code);
    if (codtipo) params = params.set('codtipo', codtipo);
    return this.http.get<CatalogoDigitalResponse>(`${this.apiUrl}/busqueda`, { params });
  }

  getDocumentUrl(filename: string): string {
    return `http://localhost:8080/documentos/${filename}`;
  }
}
