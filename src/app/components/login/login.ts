import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {LoginRequest} from '../../models/login-request';
import {FormsModule, NgForm} from '@angular/forms';
import {ApiAuthService} from '../../services/api/api-auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private apiAuthService = inject(ApiAuthService);
  private router = inject(Router);
  errorMessage = '';


  submit(loginForm: NgForm) {
    const loginInfo: LoginRequest = loginForm.value;

    this.apiAuthService.login$(loginInfo).subscribe({
      next: (data) => {
        localStorage.setItem('loginToken', data);
        this.apiAuthService.isLogged.next(true);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.error;
      }
    })
  }

}
