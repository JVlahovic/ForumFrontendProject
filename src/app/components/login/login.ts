import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {LoginRequest} from '../../models/login-request';
import {FormsModule, NgForm} from '@angular/forms';
import {ApiAuthService} from '../../services/api/api-auth.service';
import {extractErrorMessage} from '../../services/api/error.util';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private apiAuthService = inject(ApiAuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
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
        this.errorMessage = extractErrorMessage(err);
        this.cdr.detectChanges();
      }
    })
  }

}
