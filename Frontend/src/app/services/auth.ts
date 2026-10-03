import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthResponse {
  success: boolean;
  message: string;
  fecha?: string;
  cedula?: string;
  user?: string;
  foto?: string;
  token?: string;
  username?: string;
  rol?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  login(login: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { login, password });
  }

  uploadFoto(login: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('login', login);
    return this.http.post(`${this.apiUrl}/uploadFoto`, formData);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  private getUserFromStorage(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  updateUser(user: AuthResponse) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
