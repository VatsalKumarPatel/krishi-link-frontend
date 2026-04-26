import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '@services/token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.hasToken()) {
    return router.createUrlTree(['/login']);
  }

  // Force password change before accessing the app
  if (tokenService.requiresPasswordChange()) {
    return router.createUrlTree(['/change-password']);
  }

  return true;
};
