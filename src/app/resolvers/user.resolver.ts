import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, EMPTY } from 'rxjs';
import { UserService } from '@services/user.service';
import { TokenService } from '@services/token.service';
import { UserProfile } from '@models/user.model';

export const userResolver: ResolveFn<UserProfile | null> = () => {
  const userService = inject(UserService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // roleGuard may have already loaded the profile before this resolver runs.
  // UserService.load() is idempotent and returns the cached value in that case.
  return userService.load().pipe(
    catchError(() => {
      // If /auth/me fails (expired token, network error) clear session and redirect
      tokenService.clearTokens();
      userService.clear();
      router.navigate(['/login']);
      return EMPTY;
    }),
  );
};
