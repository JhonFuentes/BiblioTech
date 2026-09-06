import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  success: boolean;
  message: string;
  nombreCompleto?: string;
  rol?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  login(login: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { login, password });
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
