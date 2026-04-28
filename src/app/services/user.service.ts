import { Injectable, signal, computed } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { UserProfile } from '@models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _profile = signal<UserProfile | null>(null);

  /** Read-only snapshot of the current user. Null until the resolver runs. */
  readonly profile = this._profile.asReadonly();

  /** Best available display name: stored userName → derived from email */
  readonly displayName = computed(() => {
    const p = this._profile();
    if (!p) return '';
    const stored = this.tokenService.getUserName();
    return stored?.trim() || this.nameFromEmail(p.email);
  });

  /** Two-letter initials from displayName */
  readonly initials = computed(() =>
    this.displayName()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('')
  );

  /** True when the current user is a platform-level SuperAdmin. */
  readonly isSuperAdmin = computed(() => this._profile()?.userType === 'SuperAdmin');

  /** Human-readable role: staffRole takes priority, else formatted userType */
  readonly roleLabel = computed(() => {
    const p = this._profile();
    if (!p) return '';
    return p.staffRole ?? this.splitCamelCase(p.userType);
  });

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Fetches /auth/me and caches the result.
   * If the profile is already loaded (e.g. loaded by roleGuard before the
   * resolver ran) it returns the cached value without an extra HTTP call.
   */
  load() {
    if (this._profile()) {
      return of(this._profile()!);
    }
    return this.authService.getCurrentUser().pipe(
      tap((me: UserProfile) => this._profile.set(me)),
    );
  }

  /** Clear profile on logout. */
  clear() {
    this._profile.set(null);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private nameFromEmail(email: string): string {
    const local = email.split('@')[0];
    return local
      .split(/[._\-+]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  private splitCamelCase(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }
}
