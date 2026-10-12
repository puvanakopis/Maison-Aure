export interface User {
  email: string;
  role: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface AuthMeResponse {
  success: boolean;
  message?: string;
  user?: User;
}
