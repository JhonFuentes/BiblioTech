import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserSession {
  success: boolean;
  message: string;
  fecha: string;
  cedula: string;
  user: string;
  foto?: string;
  token: string;
  username: string;
  saludos?: string;
}

export interface RolMovil {
  codr: number;
  nombre: string;
  estado: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storageKey = 'bibliotech_movil_user';

  private currentUserSubject = new BehaviorSubject<UserSession | null>(this.loadStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  private loadStoredUser(): UserSession | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  get currentUser(): UserSession | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUser?.token || null;
  }

  login(login: string, password: string): Observable<UserSession> {
    return this.http.post<UserSession>(`${environment.apiUrl}/auth/login`, { login, password }).pipe(
      tap((res) => {
        if (res && res.success) {
          localStorage.setItem(this.storageKey, JSON.stringify(res));
          this.currentUserSubject.next(res);
        }
      })
    );
  }

  getRolesUsuario(login: string): Observable<RolMovil[]> {
    return this.http.get<RolMovil[]>(`${environment.apiUrl}/menu/usuario/${login}/roles`);
  }

  getFotoUrl(foto?: string): string {
    if (foto) {
      return `${environment.baseUrl}/fotos/${foto}`;
    }
    return 'assets/default.png';
  }

  uploadFotoPerfil(file: File, login: string): Observable<{ success: boolean; foto: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('login', login);
    return this.http.post<{ success: boolean; foto: string }>(`${environment.apiUrl}/auth/uploadFoto`, formData).pipe(
      tap((res) => {
        if (res && res.success && res.foto && this.currentUser) {
          const updated: UserSession = { ...this.currentUser, foto: res.foto };
          localStorage.setItem(this.storageKey, JSON.stringify(updated));
          this.currentUserSubject.next(updated);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }
}

