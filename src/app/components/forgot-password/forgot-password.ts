import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {ApiAuthService} from '../../services/api/api-auth.service';
import {FormsModule, NgForm} from '@angular/forms';
import {extractErrorMessage} from '../../services/api/error.util';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  private apiAuthService = inject(ApiAuthService);
  private cdr = inject(ChangeDetectorRef);

  step: 1 | 2 | 3 = 1;
  email = '';
  successMessage = '';
  errorMessage = '';

  requestCode(form: NgForm) {
    this.email = form.value.email;
    this.errorMessage = '';
    this.apiAuthService.resetPasswordRequest$(form.value).subscribe({
      next: () => {
        this.successMessage = 'A verification code has been sent to your email.';
        this.step = 2;
        this.cdr.detectChanges();
      },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  confirmCode(form: NgForm) {
    this.errorMessage = '';
    const body = { email: this.email, verificationCode: form.value.verificationCode };
    this.apiAuthService.resetPasswordConfirm$(body).subscribe({
      next: () => {
        this.successMessage = 'Your new password has been emailed to you.';
        this.step = 3;
        this.cdr.detectChanges();
      },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  resendCode() {
    this.errorMessage = '';
    this.apiAuthService.resetPasswordRequest$({ email: this.email }).subscribe({
      next: () => { this.successMessage = 'A new code has been sent.'; this.cdr.detectChanges(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }


}
