import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {ApiForumService} from '../../services/api/api-forum.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {ThreadRead} from '../../models/thread-read';
import {DatePipe} from '@angular/common';
import {ApiAuthService} from '../../services/api/api-auth.service';
import {extractErrorMessage} from '../../services/api/error.util';

@Component({
  selector: 'app-thread-list',
  imports: [RouterModule, DatePipe],
  templateUrl: './thread-list.html',
  styleUrl: './thread-list.css',
})
export class ThreadList {

  private apiForumService = inject(ApiForumService);
  private apiAuthService = inject(ApiAuthService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  categoryId = 0;
  threads: ThreadRead[] = [];
  errorMessage = '';

  ngOnInit() {
    this.categoryId = Number(this.activatedRoute.snapshot.paramMap.get('categoryId'));
    this.loadThreads();
  }

  private loadThreads() {
    this.apiForumService.getThreadsByCategory$(this.categoryId).subscribe({
      next: data => {
        this.threads = data;
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMessage = extractErrorMessage(err);
        this.cdr.detectChanges();
      }
    });
  }

  get isLogged() {
    return this.apiAuthService.isLogged.value;
  }

}
