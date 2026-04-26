import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_INFO = 'user_info';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly REQUIRES_PW_CHANGE_KEY = 'requires_pw_change';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setUserInfo(userInfo: string): void {
    localStorage.setItem(this.USER_INFO, userInfo);
  }

  getUserInfo(): string | null {
    return localStorage.getItem(this.USER_INFO);
  }

  setUserName(name: string): void {
    localStorage.setItem(this.USER_NAME_KEY, name);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.USER_NAME_KEY);
  }

  setRequiresPasswordChange(value: boolean): void {
    if (value) {
      sessionStorage.setItem(this.REQUIRES_PW_CHANGE_KEY, '1');
    } else {
      sessionStorage.removeItem(this.REQUIRES_PW_CHANGE_KEY);
    }
  }

  requiresPasswordChange(): boolean {
    return sessionStorage.getItem(this.REQUIRES_PW_CHANGE_KEY) === '1';
  }

  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO);
    localStorage.removeItem(this.USER_NAME_KEY);
    sessionStorage.removeItem(this.REQUIRES_PW_CHANGE_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
