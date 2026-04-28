import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unauthorized.component.html',
  styles: [':host { display: contents; }'],
})
export class UnauthorizedComponent {
  readonly userService = inject(UserService);

  /** Navigate to the correct home for the current role. */
  get homePath(): string {
    return this.userService.isSuperAdmin() ? '/admin/tenants' : '/dashboard';
  }
}
