import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

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

  private menuChangesSubject = new Subject<void>();
  menuChanges$ = this.menuChangesSubject.asObservable();

  private activeMenusSubject = new BehaviorSubject<Menu[]>([]);
  activeMenus$ = this.activeMenusSubject.asObservable();

  private activeRolSubject = new BehaviorSubject<Rol | null>(null);
  activeRol$ = this.activeRolSubject.asObservable();

  private menusLoadedSubject = new BehaviorSubject<boolean>(false);
  menusLoaded$ = this.menusLoadedSubject.asObservable();

  notifyMenuChanges() {
    this.menuChangesSubject.next();
  }

  setActiveRolMenus(rol: Rol | null, menus: Menu[], loaded: boolean = true) {
    this.activeRolSubject.next(rol);
    this.activeMenusSubject.next(menus || []);
    this.menusLoadedSubject.next(loaded);
  }

  normalizarRuta(enlace: string): string {
    return (enlace || '').trim().replace(/^\/+/, '').split('?')[0].toLowerCase();
  }

  isRutaPermitida(ruta: string): boolean {
    const target = this.normalizarRuta(ruta);
    if (!target || target === 'inicio' || target === 'modificar-fotos') {
      return true;
    }
    const menus = this.activeMenusSubject.value || [];
    for (const m of menus) {
      if (m.procesos && m.procesos.some(p => this.normalizarRuta(p.enlace) === target)) {
        return true;
      }
    }
    return false;
  }

  isMenusLoaded(): boolean {
    return this.menusLoadedSubject.value;
  }

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
    return this.http.post<Menu>(`${this.apiUrl}/crud`, menu).pipe(
      tap(() => this.notifyMenuChanges())
    );
  }

  modificarMenu(id: number, menu: { nombre: string; estado?: number }): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/crud/${id}`, menu).pipe(
      tap(() => this.notifyMenuChanges())
    );
  }

  eliminarMenu(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/crud/${id}`).pipe(
      tap(() => this.notifyMenuChanges())
    );
  }

  activarMenu(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/crud/${id}/activar`, {}).pipe(
      tap(() => this.notifyMenuChanges())
    );
  }
}
