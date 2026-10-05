import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ApiUserService} from '../../services/api/api-user.service';
import {UserProfile} from '../../models/user-profile';
import {ThreadRead} from '../../models/thread-read';
import {extractErrorMessage} from '../../services/api/error.util';
import {ChangePassword} from '../change-password/change-password';

@Component({
  selector: 'app-user-panel',
  imports: [DatePipe, RouterModule, ChangePassword],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.css',
})
export class UserPanel {

  private apiUserService = inject(ApiUserService);
  private cdr = inject(ChangeDetectorRef);

  profile?: UserProfile;
  threads: ThreadRead[] = [];
  errorMessage = '';

  ngOnInit() {
    this.loadProfile();
    this.loadThreads();
  }

  private loadProfile() {
    this.apiUserService.getProfile$().subscribe({
      next: data => { this.profile = data; this.cdr.detectChanges(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  private loadThreads() {
    this.apiUserService.getMyThreads$().subscribe({
      next: data => { this.threads = data; this.cdr.detectChanges(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }


}
