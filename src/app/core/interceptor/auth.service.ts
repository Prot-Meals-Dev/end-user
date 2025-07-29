import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'user';
  private baseUrl = `${environment.apiUrl}/auth/otp`;

  constructor(private http: HttpClient) { }

  requestOtp(email: string): Observable<any> {    
    return this.http.post(`${this.baseUrl}/generate`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/verify`, { email, otp }).pipe(
      tap(response => {
        if (response.success && response.data.access_token) {
          localStorage.setItem(this.tokenKey, response.data.access_token);
          localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}
