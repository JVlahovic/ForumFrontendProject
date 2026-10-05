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
  canPost = false;

  ngOnInit() {
    this.categoryId = Number(this.activatedRoute.snapshot.paramMap.get('categoryId'));
    this.loadThreads();
    this.loadCanPost();
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

  private loadCanPost() {
    this.apiForumService.getCategories$().subscribe({
      next: cats => {
        this.canPost = cats.find(c => c.id === this.categoryId)?.canPost ?? false;
        this.cdr.detectChanges();
      },
      error: () => { /* leave canPost false */ }
    });
  }

  get isLogged() {
    return this.apiAuthService.isLogged.value;
  }

}
