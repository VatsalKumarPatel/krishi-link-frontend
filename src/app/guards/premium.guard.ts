import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@services/user.service';

/**
 * PremiumGuard — allows access only if the tenant is on the Premium plan.
 * The UserProfile.planTier field carries "Core" | "Premium".
 * If tenant is Core, redirects to the /purchase/upgrade route which shows
 * a locked upgrade-prompt page.
 */
export const premiumGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const profile = userService.profile();
  // If profile not loaded yet, let them through (resolver will handle)
  if (!profile) return true;

  const isPremium = (profile as any).planTier === 'Premium';
  if (isPremium) return true;

  return router.createUrlTree(['/purchase/upgrade']);
};
