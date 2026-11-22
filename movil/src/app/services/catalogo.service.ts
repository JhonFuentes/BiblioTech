import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TipoTextoMovil {
  codtipo: number;
  tipoNombre: string;
  sw: number;
  docum?: string;
}

export interface TextoMovil {
  codt: number;
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
  autoresNombres?: string[];
  tipos?: TipoTextoMovil[];
}

export interface EjemplarMovil {
  codinv: number;
  disponible: number; // 1=Libre, 0=Ocupado
  estado: number;     // 1=Activo, 0=Baja
  codt: number;
  tituloTexto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoMovilService {
  private http = inject(HttpClient);

  buscarDigitales(titulo?: string, autor?: string, coda?: number): Observable<{ total: number; items: TextoMovil[] }> {
    let params = new HttpParams();
    if (titulo && titulo.trim()) params = params.set('titulo', titulo.trim());
    if (autor && autor.trim()) params = params.set('autor', autor.trim());
    if (coda) params = params.set('coda', coda);
    return this.http.get<{ total: number; items: TextoMovil[] }>(`${environment.apiUrl}/catalogo-digital/busqueda`, { params });
  }

  listarAreas(): Observable<{ coda: number; nombre: string; estado: number }[]> {
    return this.http.get<{ coda: number; nombre: string; estado: number }[]>(`${environment.apiUrl}/areas`);
  }

  listarTextos(): Observable<TextoMovil[]> {
    return this.http.get<TextoMovil[]>(`${environment.apiUrl}/textos`);
  }

  listarEjemplaresPorTexto(codt: number): Observable<EjemplarMovil[]> {
    return this.http.get<EjemplarMovil[]>(`${environment.apiUrl}/ejemplares`, {
      params: { codt, estado: 1 }
    });
  }

  getDocumentoUrl(docum: string): string {
    return `${environment.baseUrl}/uploads/documentos/${docum}`;
  }
}

