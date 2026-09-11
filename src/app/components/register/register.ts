import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../models/register-request';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiAuthService } from '../../services/api/api-auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private apiAuthService = inject(ApiAuthService);
  private router = inject(Router);
  errorMessage = '';

  submit(registerForm: NgForm) {
    const registerInfo: RegisterRequest = registerForm.value;
    this.apiAuthService.register$(registerInfo).subscribe({
      next: () => this.router.navigate(['/verify'], { queryParams: { email: registerInfo.email } }), //i am passing the email onto verify and hiding it cause the user shouldn't have to bother typing it out again.
      error: (err) => this.errorMessage = err.error
    });
  }

}
