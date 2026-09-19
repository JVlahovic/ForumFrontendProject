import {ChangeDetectorRef, Component, DestroyRef, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ApiForumService} from '../../services/api/api-forum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ThreadRead} from '../../models/thread-read';
import {PostRead} from '../../models/post-read';
import {extractErrorMessage} from '../../services/api/error.util';
import {Page} from '../../models/page';
import {ApiAuthService} from '../../services/api/api-auth.service';
import {FormsModule, NgForm} from '@angular/forms';
import {combineLatest} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-thread-detail',
  imports: [DatePipe, FormsModule],
  templateUrl: './thread-detail.html',
  styleUrl: './thread-detail.css',
})
export class ThreadDetail {


  private apiForumService = inject(ApiForumService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private apiAuthService = inject(ApiAuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);



  threadId = 0;
  thread?: ThreadRead;
  originalPost?: PostRead;
  replies: PostRead[] = [];
  errorMessage = '';

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  get isLogged() {
    return this.apiAuthService.isLogged.value;
  }

  ngOnInit() {
    combineLatest([
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParams
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params, query]) => {
        const id = Number(params.get('threadId'));
        if (id !== this.threadId) {          // param change into reload thread (avoids redundant calls)
          this.threadId = id;
          this.loadThread();
        }
        const urlPage = Number(query['page']);            // 1-based; missing/invalid → page 1
        this.currentPage = (!urlPage || urlPage < 1) ? 0 : urlPage - 1;
        this.loadPosts();
      });
  }

  private loadThread() {
    this.apiForumService.getThread$(this.threadId).subscribe({
      next: data => {this.thread = data; this.cdr.detectChanges();},
      error: err => {this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges();}
    });
  }

  //original post / opening thread post is only on page 1. no need to carry it over.
  private loadPosts() {
    this.apiForumService.getPostsByThreadId$(this.threadId, this.currentPage).subscribe({
      next: (page: Page<PostRead>) => {
        // A shared link may point past the end → snap to the last real page.
        if (page.totalPages > 0 && page.number >= page.totalPages) {
          this.goToPage(page.totalPages - 1);
          return;
        }

        this.currentPage = page.number;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.pageSize = page.size;

        if (page.number === 0) {
          this.originalPost = page.content[0];
          this.replies = page.content.slice(1);
        } else {
          this.originalPost = undefined;
          this.replies = page.content;
        }
        this.cdr.detectChanges();
      },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }



  goToPage(page: number) {
    if (page < 0 || (this.totalPages && page >= this.totalPages)) return;

    if (page === this.currentPage) {                 // navigation to same URL won't re-emit queryParams
      this.loadPosts();                              // force refresh (e.g. reply within current page)
      return;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: page === 0 ? null : page + 1 },   // 1-based; omit on page 1
      queryParamsHandling: 'merge'
    });                                              // queryParams subscription drives loadPosts
  }

  submitReply(replyForm: NgForm) {
    if (replyForm.invalid) return;

    this.apiForumService.createPost$(this.threadId, replyForm.value).subscribe({
      next: () => {
        replyForm.resetForm();
        const newTotal = this.totalElements + 1;
        const lastPage = Math.max(0, Math.ceil(newTotal / this.pageSize) - 1);
        this.goToPage(lastPage);                     // jump to where the new reply lives
      },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }


}
