import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { TokenService } from '@services/token.service';
import { Router } from '@angular/router';
import { LoginViewModel } from '@models/login.model';
import { AlertComponent } from '@components/shared/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  credentials: LoginViewModel = {
    email: '',
    password: '',
    rememberMe: false,
  };

  isLoading = signal(false);
  error = signal<string>("");
  authService = inject(AuthService);
  tokenService = inject(TokenService);

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    // Redirect if already logged in
    if (this.tokenService.hasToken()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) {
      this.error.set('Please enter both email and password');
      return;
    }

    this.isLoading.set(true);
    this.error.set("");

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.tokenService.setToken(response.accessToken);
        if (response.refreshToken) {
          this.tokenService.setRefreshToken(response.refreshToken);
        }
        if (response.userName) {
          this.tokenService.setUserName(response.userName);
        }
        if (response.requiresPasswordChange) {
          this.tokenService.setRequiresPasswordChange(true);
          this.router.navigate(['/change-password']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.error.set(error.error?.message || 'Login failed. Please try again.');
        console.error('Login error:', error);
      },
    });
  }
}
