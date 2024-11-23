import { Routes, RouterModule } from '@angular/router';
import { ingresoGuard } from './guards/ingreso-guard.service';
import { inicioGuard } from './guards/inicio-guard.service';
import { ForoComponent } from './components/foro/foro.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ingreso', // Redirige por defecto a la página de ingreso
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    //canActivate: [inicioGuard] // Activa si quieres proteger esta ruta
  },
  {
    path: 'theme',
    loadComponent: () => import('./pages/theme/theme.page').then(m => m.ThemePage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage),
    canActivate: [inicioGuard] // Protege la página de inicio con el guard
  },
  {
    path: 'foro', // Ruta para el foro
    component: ForoComponent // Componente del foro
  },
  {
    path: 'ingreso',
    loadComponent: () => import('./pages/ingreso/ingreso.page').then(m => m.IngresoPage),
    // canActivate: [ingresoGuard] // Protege ingreso si el usuario ya está autenticado
  },
  {
    path: 'correo', // Ruta pública
    loadComponent: () => import('./pages/correo/correo.page').then(m => m.CorreoPage)
  },
  {
    path: 'pregunta', // Ruta pública
    loadComponent: () => import('./pages/pregunta/pregunta.page').then(m => m.PreguntaPage)
  },
  {
    path: 'correcto', // Ruta pública
    loadComponent: () => import('./pages/correcto/correcto.page').then(m => m.CorrectoPage)
  },
  {
    path: 'incorrecto', // Ruta pública
    loadComponent: () => import('./pages/incorrecto/incorrecto.page').then(m => m.IncorrectoPage)
  },
  {
    path: 'registrarme', // Ruta pública para registro
    loadComponent: () => import('./pages/registrarme/registrarme.page').then(m => m.RegistrarmePage)
  }
];
