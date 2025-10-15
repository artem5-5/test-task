export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TwoFACredentials {
  code: string;
  tempToken: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  requiresTwoFA?: boolean;
  tempToken?: string;
  token?: string;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
}

export interface TwoFAFormErrors {
  code?: string;
}