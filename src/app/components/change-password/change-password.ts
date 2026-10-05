import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {ApiUserService} from '../../services/api/api-user.service';
import {extractErrorMessage} from '../../services/api/error.util';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {

  private apiUserService = inject(ApiUserService);
  private cdr = inject(ChangeDetectorRef);

  successMessage = '';
  errorMessage = '';

  submit(form: NgForm) {
    this.successMessage = '';
    this.errorMessage = '';

    const oldPassword = form.value.oldPassword;
    const newPassword = form.value.newPassword;
    const confirmPassword = form.value.confirmPassword;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'New password and confirmation do not match.';
      this.cdr.detectChanges();
      return;
    }

    this.apiUserService.changePassword$({oldPassword, newPassword}).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully.';
        form.resetForm();
        this.cdr.detectChanges();
      },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }


}
