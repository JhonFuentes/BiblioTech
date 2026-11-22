import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MenuService } from './menu.service';

export interface Rol {
  codr?: number;
  nombre: string;
  estado?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private http = inject(HttpClient);
  private menuService = inject(MenuService);
  private apiUrl = 'http://localhost:8080/api/roles';

  listar(filtroNombre?: string, filtroEstado?: number): Observable<Rol[]> {
    let params = new HttpParams();
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<Rol[]>(this.apiUrl, { params });
  }

  listarPaginado(page: number = 0, size: number = 15, filtroNombre?: string, filtroEstado?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filtroNombre) params = params.set('filtroNombre', filtroNombre);
    if (filtroEstado !== undefined && filtroEstado !== -1) params = params.set('filtroEstado', filtroEstado);
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  crear(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol).pipe(
      tap(() => this.menuService.notifyMenuChanges())
    );
  }

  modificar(id: number, rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, rol).pipe(
      tap(() => this.menuService.notifyMenuChanges())
    );
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.menuService.notifyMenuChanges())
    );
  }

  habilitar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/activar`, {}).pipe(
      tap(() => this.menuService.notifyMenuChanges())
    );
  }
}
