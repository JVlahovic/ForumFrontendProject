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

  editingPostId: number | null = null;
  editContent = '';

  get isLogged() {
    return this.apiAuthService.isLogged.value;
  }

  get currentUsername(): string | null {
    return this.apiAuthService.getUsernameFromToken();
  }

  isOwn(post: PostRead): boolean {
    return post.authorUsername === this.currentUsername;
  }

  canEdit(post: PostRead): boolean {
    return this.isOwn(post);
  }

  canDelete(post: PostRead): boolean {
    return this.isOwn(post) || this.canModerate;
  }

  get canModerate(): boolean {
    const role = (this.apiAuthService.getRoleFromToken() ?? '').toUpperCase();
    return role === 'ADMIN' || role === 'MODERATOR';
  }

  ngOnInit() {
    combineLatest([
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParams
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params, query]) => {
        const id = Number(params.get('threadId'));
        if (id !== this.threadId) {
          this.threadId = id;
          this.loadThread();
        }
        const urlPage = Number(query['page']);
        this.currentPage = (!urlPage || urlPage < 1) ? 0 : urlPage - 1;
        this.loadPosts();
      });
  }

  private loadThread() {
    this.apiForumService.getThread$(this.threadId).subscribe({
      next: data => { this.thread = data; this.cdr.detectChanges(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  private loadPosts() {
    this.apiForumService.getPostsByThreadId$(this.threadId, this.currentPage).subscribe({
      next: (page: Page<PostRead>) => {
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
    if (page === this.currentPage) {
      this.loadPosts();
      return;
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: page === 0 ? null : page + 1 },
      queryParamsHandling: 'merge'
    });
  }

  submitReply(replyForm: NgForm) {
    if (replyForm.invalid) return;
    this.apiForumService.createPost$(this.threadId, replyForm.value).subscribe({
      next: () => {
        replyForm.resetForm();
        const newTotal = this.totalElements + 1;
        const lastPage = Math.max(0, Math.ceil(newTotal / this.pageSize) - 1);
        this.goToPage(lastPage);
      },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  // ---------- post edit ----------
  startEdit(post: PostRead) {
    this.editingPostId = post.id;
    this.editContent = post.content;
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editingPostId = null;
    this.editContent = '';
    this.cdr.detectChanges();
  }

  saveEdit(post: PostRead) {
    this.apiForumService.updatePost$(post.id, {content: this.editContent}).subscribe({
      next: () => {
        this.editingPostId = null;
        this.editContent = '';
        this.loadPosts();
      },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  // ---------- post delete ----------
  deleteReply(post: PostRead) {
    if (!confirm('Delete this reply?')) return;
    this.apiForumService.deletePost$(post.id).subscribe({
      next: () => this.loadPosts(),
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  // ---------- thread moderation ----------
  togglePin() {
    this.apiForumService.togglePin$(this.threadId).subscribe({
      next: t => { this.thread = t; this.cdr.detectChanges(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  toggleLock() {
    this.apiForumService.toggleLock$(this.threadId).subscribe({
      next: t => { this.thread = t; this.cdr.detectChanges(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  deleteThread() {
    if (!confirm('Delete this entire thread?')) return;
    const categoryId = this.thread?.threadCategoryId;
    this.apiForumService.deleteThread$(this.threadId).subscribe({
      next: () => this.router.navigate(['/category', categoryId]),
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }


}
