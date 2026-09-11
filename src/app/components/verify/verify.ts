import {ChangeDetectorRef, Component, inject} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { VerifyRequest } from '../../models/verify-request';
import { ApiAuthService } from '../../services/api/api-auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-verify',
  imports: [FormsModule],
  templateUrl: './verify.html',
  styleUrl: './verify.css',
})
export class Verify {

  private apiAuthService = inject(ApiAuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.email = this.activatedRoute.snapshot.queryParams['email'] || '';
  }

  submit(verifyForm: NgForm) {
    const verifyInfo: VerifyRequest = verifyForm.value;
    this.apiAuthService.verify$(verifyInfo).subscribe({
      next: () => { //right after next, a full-blown code block can be done with another pair of curly braces.
        this.successMessage = 'Verification successfully completed. Routing you to the login page.';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => this.errorMessage = err.error
    });
  }

  resend() {
    this.apiAuthService.resend$({ email: this.email }).subscribe({
      next: () => this.successMessage = 'New code sent! Check your email again for the new code.',
      error: (err) => this.errorMessage = err.error
    });
  }

}
