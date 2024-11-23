import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const inicioGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Lista de rutas públicas que no deben ser afectadas
  const publicRoutes = ['/correo', '/pregunta', '/registrarme', '/correcto', '/incorrecto'];

  // Si la ruta es pública, permitir acceso
  if (publicRoutes.some((publicRoute) => state.url.includes(publicRoute))) {
    return true;
  }

  // Si el usuario no está autenticado, redirigir a ingreso
  if (!(await authService.isAuthenticated())) {
    router.navigate(['/ingreso']);
    return false; // Negar acceso a la página de inicio
  }

  // Permitir acceso a la página de inicio si está autenticado
  return true;
};
