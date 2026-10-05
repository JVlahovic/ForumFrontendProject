import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { RegisterRequest } from '../../models/register-request';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiAuthService } from '../../services/api/api-auth.service';
import {extractErrorMessage} from '../../services/api/error.util';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private apiAuthService = inject(ApiAuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  errorMessage = '';

  submit(registerForm: NgForm) {
    const registerInfo: RegisterRequest = registerForm.value;
    this.apiAuthService.register$(registerInfo).subscribe({
      next: () => this.router.navigate(['/verify'], { queryParams: { email: registerInfo.email } }), //i am passing the email onto verify and hiding it cause the user shouldn't have to bother typing it out again.
      error: (err) => {
        this.errorMessage = extractErrorMessage(err)
        this.cdr.detectChanges();
      }
    });
  }

}
