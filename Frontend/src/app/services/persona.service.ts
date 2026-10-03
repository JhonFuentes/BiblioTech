import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Persona {
  codper?: number;
  ci?: number;
  nombre: string;
  ap: string;
  am: string;
  genero: string;
  estado?: number;
  tipoper: string;
  foto?: string;
  telefonos: string[];
  hasLogin?: boolean;
  login?: string;
}

export interface Acceso {
  login: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/personas';

  listar(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  crear(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona);
  }

  modificar(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, persona);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/activar`, {});
  }

  asignarAcceso(id: number, acceso: Acceso): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/acceso`, acceso);
  }

  modificarAcceso(id: number, acceso: Acceso): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/acceso`, acceso);
  }
}
