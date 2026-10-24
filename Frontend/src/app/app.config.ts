import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { IMAGE_CONFIG } from '@angular/common';
import { 
  LucideAngularModule, 
  Menu, ChevronDown, ChevronRight, User, LogOut, LogIn, Camera, Search, Plus, 
  Pencil, Trash, CheckCircle, Key, Lock, Eye, Check, X, Printer, Unlock, 
  RefreshCw, LayoutGrid, Box, Heart, ChevronUp, MoreVertical, Home,
  Folder, FolderX, Building, BookOpen, Book, FileText, Layers, Users, 
  UserCheck, UserX, Library, Sparkles, ShieldCheck, Image
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true } },
    importProvidersFrom(LucideAngularModule.pick({ 
      Menu, ChevronDown, ChevronRight, User, LogOut, LogIn, Camera, Search, Plus, 
      Pencil, Trash, CheckCircle, Key, Lock, Eye, Check, X, Printer, Unlock, 
      RefreshCw, LayoutGrid, Box, Heart, ChevronUp, MoreVertical, Home,
      Folder, FolderX, Building, BookOpen, Book, FileText, Layers, Users, 
      UserCheck, UserX, Library, Sparkles, ShieldCheck, Image
    }))
  ]
};

