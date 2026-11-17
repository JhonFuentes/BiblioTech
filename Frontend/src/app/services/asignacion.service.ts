import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AsignacionItem {
  id: string;
  nombre: string;
  detalle?: string;
  asignado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/asignaciones';

  // B-17: MEPRO
  listarProcesosPorMenu(codm: number): Observable<AsignacionItem[]> {
    return this.http.get<AsignacionItem[]>(`${this.apiUrl}/mepro/menu/${codm}`);
  }

  toggleMePro(codm: number, codp: number, asignar: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/mepro/toggle`, { codm, codp, asignar });
  }

  // B-18: ROLME
  listarMenusPorRol(codr: number): Observable<AsignacionItem[]> {
    return this.http.get<AsignacionItem[]>(`${this.apiUrl}/rolme/rol/${codr}`);
  }

  toggleRolMe(codr: number, codm: number, asignar: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/rolme/toggle`, { codr, codm, asignar });
  }

  // B-19: ROLUSU
  listarRolesPorUsuario(login: string): Observable<AsignacionItem[]> {
    return this.http.get<AsignacionItem[]>(`${this.apiUrl}/rolusu/usuario/${login}`);
  }

  toggleRolUsu(login: string, codr: number, asignar: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/rolusu/toggle`, { login, codr, asignar });
  }
}
