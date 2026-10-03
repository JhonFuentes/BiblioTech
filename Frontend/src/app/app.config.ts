import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LucideAngularModule, Menu, ChevronDown, ChevronRight, User, LogOut, LogIn, Camera, Search, Plus, Pencil, Trash, CheckCircle, Key, Lock, Eye, Check, X } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(LucideAngularModule.pick({ Menu, ChevronDown, ChevronRight, User, LogOut, LogIn, Camera, Search, Plus, Pencil, Trash, CheckCircle, Key, Lock, Eye, Check, X }))
  ]
};
