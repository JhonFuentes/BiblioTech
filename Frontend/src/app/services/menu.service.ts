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

  listarCrud(filtroNombre?: string, filtroEstado?: number): Observable<Menu[]> {
    let params: any = {};
    if (filtroNombre) params.filtroNombre = filtroNombre;
    if (filtroEstado !== undefined && filtroEstado !== -1) params.filtroEstado = filtroEstado;
    return this.http.get<Menu[]>(`${this.apiUrl}/crud`, { params });
  }

  listarCrudPaginado(page: number = 0, size: number = 10, filtroNombre?: string, filtroEstado?: number): Observable<any> {
    let params: any = { page, size };
    if (filtroNombre) params.filtroNombre = filtroNombre;
    if (filtroEstado !== undefined && filtroEstado !== -1) params.filtroEstado = filtroEstado;
    return this.http.get<any>(`${this.apiUrl}/crud/page`, { params });
  }

  crearMenu(menu: { nombre: string }): Observable<Menu> {
    return this.http.post<Menu>(`${this.apiUrl}/crud`, menu);
  }

  modificarMenu(id: number, menu: { nombre: string; estado?: number }): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/crud/${id}`, menu);
  }

  eliminarMenu(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/crud/${id}`);
  }

  activarMenu(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/crud/${id}/activar`, {});
  }
}
