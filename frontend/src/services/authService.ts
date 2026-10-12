import apiClient from "./api";
import {
  AuthResponse,
  AuthMeResponse,
  LoginCredentials,
  User,
} from "@/interfaces/auth.interface";

const TOKEN_KEY = "maison_aure_auth_token";
const USER_KEY = "maison_aure_auth_user";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/login", credentials);
    if (res.token) {
      this.setToken(res.token);
    }
    if (res.user) {
      this.setUser(res.user);
    }
    return res;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<AuthMeResponse>("/auth/me");
    if (res.user) {
      this.setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || "Failed to retrieve user profile");
  },

  logout(): void {
    this.removeToken();
    this.removeUser();
    if (typeof window !== "undefined") {
      localStorage.removeItem("maison_aure_admin_auth");
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem("maison_aure_admin_auth", "true");
  },

  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
