import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const ingresoGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Lista de rutas públicas que no deben ser afectadas
  const publicRoutes = ['/correo', '/pregunta', '/registrarme', '/correcto', '/incorrecto'];

  // Si la ruta es pública, permitir acceso
  if (publicRoutes.some((publicRoute) => state.url.includes(publicRoute))) {
    return true;
  }

  // Si el usuario está autenticado, redirigir al inicio
  if (await authService.isAuthenticated()) {
    router.navigate(['/inicio']);
    return false; // Negar acceso a la página de ingreso
  }

  // Permitir acceso a la página de ingreso si no está autenticado
  return true;
};
