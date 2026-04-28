import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { UserService } from '@services/user.service';

/**
 * Role-based access guard.
 *
 * Route data flags:
 *   adminOnly: true          → only SuperAdmin can access (others → /unauthorized)
 *   excludeSuperAdmin: true  → SuperAdmin cannot access (→ /unauthorized)
 *
 * Angular runs guards BEFORE parent resolvers on fresh page loads, so this
 * guard loads the user profile itself when it isn't cached yet.
 * UserService.load() is idempotent — it skips the HTTP call if already loaded.
 */
export const roleGuard: CanActivateFn = (route) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const check = (): boolean | UrlTree => {
    const isSuperAdmin = userService.isSuperAdmin();
    const adminOnly = !!route.data['adminOnly'];
    const excludeSuperAdmin = !!route.data['excludeSuperAdmin'];

    if (adminOnly && !isSuperAdmin) return router.createUrlTree(['/unauthorized']);
    if (excludeSuperAdmin && isSuperAdmin) return router.createUrlTree(['/unauthorized']);
    return true;
  };

  // Profile already in memory → check immediately (fast path for in-app navigation)
  if (userService.profile()) {
    return check();
  }

  // Profile not yet loaded (fresh page load — resolver hasn't run yet)
  // Load it now; UserService caches the result so the resolver won't double-fetch
  return userService.load().pipe(
    map(() => check()),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
