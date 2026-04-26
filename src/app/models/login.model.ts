export interface LoginViewModel {
  email:string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;          // Guid → string
  userName: string;
  userType: string;
  staffRole?: string | null;
  storeIds: string[];      // IEnumerable<Guid> → string[]
  expiresAt: string; 
  requiresPasswordChange: boolean;
}
