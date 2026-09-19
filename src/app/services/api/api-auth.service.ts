import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../../environments/environment';
import {RegisterRequest} from '../../models/register-request';
import {LoginRequest} from '../../models/login-request';
import {VerifyRequest} from '../../models/verify-request';
import {BehaviorSubject} from 'rxjs';
import {ResendRequest} from '../../models/resend-request';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService {

  private http = inject(HttpClient);
  private url = Environment.apiUrl;
  isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    if (this.hasValidToken()) {
      this.isLogged.next(true);
    } else {
      this.clearSession();
    }
  }

  private decodeToken(token: string): any | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string | null = localStorage.getItem('loginToken')): boolean {
    if(!token) return true;
    const payload = this.decodeToken(token);
    if(!payload?.exp) return true;
    return payload.exp * 1000 <= Date.now();
  }

  hasValidToken(): boolean {
    const token = localStorage.getItem('loginToken');
    return !!token && !this.isTokenExpired(token);
  }

  clearSession(): void {
    localStorage.removeItem('loginToken');
    this.isLogged.next(false);
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('loginToken');
    if (!token) return null;
    const payload = this.decodeToken(token);
    return (payload?.username as string) ?? null;
  }

  register$(data: RegisterRequest) {
    return this.http.post(
      this.url + '/register',
      data,
      { responseType: 'text'}
    );
  }

  login$(data: LoginRequest) {
    return this.http.post(
      this.url + '/login',
      data,
      { responseType: 'text'}
    );
  }

  verify$(data: VerifyRequest) {
    return this.http.post(
      this.url + '/emailVerify/verify',
      data,
      { responseType: 'text'}
    );
  }

  resend$(data: ResendRequest) {
    return this.http.post(
      this.url + '/emailVerify/resend',
      data,
      { responseType: 'text'}
    );
  }


}
