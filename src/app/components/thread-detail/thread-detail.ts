import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ApiForumService} from '../../services/api/api-forum.service';
import {ActivatedRoute} from '@angular/router';
import {ThreadRead} from '../../models/thread-read';
import {PostRead} from '../../models/post-read';
import {extractErrorMessage} from '../../services/api/error.util';
import {Page} from '../../models/page';
import {ApiAuthService} from '../../services/api/api-auth.service';
import {FormsModule, NgForm} from '@angular/forms';

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

  get isLogged() {
    return this.apiAuthService.isLogged.value;
  }

  threadId = 0;
  thread?: ThreadRead;
  originalPost?: PostRead;
  replies: PostRead[] = [];
  errorMessage = '';

  ngOnInit() {
    this.threadId = Number(this.activatedRoute.snapshot.paramMap.get('threadId'));
    this.loadThread();
    this.loadPosts();
  }

  private loadThread() {
    this.apiForumService.getThread$(this.threadId).subscribe({
      next: data => {this.thread = data; this.cdr.detectChanges();},
      error: err => {this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges();}
    });
  }

  private loadPosts() {
    this.apiForumService.getPostsByThreadId$(this.threadId).subscribe({
      next: (page: Page<PostRead>) => {
        this.originalPost = page.content[0];
        this.replies = page.content.slice(1);
        this.cdr.detectChanges();
      },
      error: err => {this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges();}
    });
  }

  submitReply(replyForm: NgForm) {
    if(replyForm.invalid) {
      return;
    }
    this.apiForumService.createPost$(this.threadId, replyForm.value).subscribe({
      next: (post: PostRead) => {
        this.replies.push(post);
        replyForm.resetForm();
        this.cdr.detectChanges();
      },
      error: err => {this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges();}
    })
  }

}
