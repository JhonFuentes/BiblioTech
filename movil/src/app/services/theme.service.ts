import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageKey = 'bibliotech_movil_theme';
  private darkModeSubject = new BehaviorSubject<boolean>(this.loadInitialTheme());
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.darkModeSubject.value);
  }

  private loadInitialTheme(): boolean {
    try {
      return localStorage.getItem(this.storageKey) === 'dark';
    } catch {
      return false;
    }
  }

  get isDark(): boolean {
    return this.darkModeSubject.value;
  }

  toggle(): void {
    const next = !this.darkModeSubject.value;
    this.setDarkMode(next);
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    try {
      localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
    } catch { }
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark-theme', isDark);
      document.body.classList.toggle('dark-theme', isDark);
    }
  }
}

