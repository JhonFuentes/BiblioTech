import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rol {
  codr: number;
  nombre: string;
  estado: number;
}

export interface Proceso {
  codp: number;
  nombre: string;
  enlace: string;
  estado: number;
}

export interface Menu {
  codm: number;
  nombre: string;
  estado: number;
  procesos: Proceso[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/menu';

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`);
  }

  getRolesUsuario(login: string): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/usuario/${login}/roles`);
  }

  getMenusPorRol(codr: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/rol/${codr}`);
  }

  getAllMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/all`);
  }
}
