import {Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {ApiAuthService} from '../../services/api/api-auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private apiAuthService = inject(ApiAuthService);
  private router = inject(Router);

  get isLogged() {
    return this.apiAuthService.isLogged.value;
  }

  logout() {
    this.apiAuthService.clearSession();
    window.location.href = '/'; //forces a refresh so when you log out the session is destroyed and noone can peep.
  }

  get username() {
    return this.apiAuthService.getUsernameFromToken() || 'User';
  }

}
