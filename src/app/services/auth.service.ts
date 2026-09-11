import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isLogged = true;

  login() {
    this.isLogged = true;
  }

  logout() {
    this.isLogged = false;
  }

}
