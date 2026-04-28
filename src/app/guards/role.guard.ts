import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@services/user.service';

/**
 * Role-based access guard.
 *
 * Route data flags:
 *   adminOnly: true        → only SuperAdmin can access (others → /unauthorized)
 *   excludeSuperAdmin: true → SuperAdmin cannot access (→ /unauthorized)
 *
 * If neither flag is set the route is accessible to all authenticated users.
 */
export const roleGuard: CanActivateFn = (route) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const isSuperAdmin = userService.isSuperAdmin();
  const adminOnly = !!route.data['adminOnly'];
  const excludeSuperAdmin = !!route.data['excludeSuperAdmin'];

  if (adminOnly && !isSuperAdmin) {
    return router.createUrlTree(['/unauthorized']);
  }

  if (excludeSuperAdmin && isSuperAdmin) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
