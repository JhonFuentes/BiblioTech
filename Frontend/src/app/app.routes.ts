import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'layout', component: Layout },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
