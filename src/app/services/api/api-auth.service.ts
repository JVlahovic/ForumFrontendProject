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
    if (localStorage.getItem('loginToken')) {
      this.isLogged.next(true);
    }
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('loginToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username as string;
    } catch {
      return null;
    }
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
