import {ChangeDetectorRef, Component, inject} from '@angular/core';
import { ThreadCreate as ThreadCreateModel} from '../../models/thread-create';
import {FormsModule, NgForm} from '@angular/forms';
import {ApiForumService} from '../../services/api/api-forum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {extractErrorMessage} from '../../services/api/error.util';

@Component({
  selector: 'app-thread-create',
  imports: [FormsModule],
  templateUrl: './thread-create.html',
  styleUrl: './thread-create.css',
})
export class ThreadCreate {

  private apiForumService = inject(ApiForumService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  categoryId = 0;
  errorMessage = '';

  ngOnInit() {
    this.categoryId = Number(this.activatedRoute.snapshot.paramMap.get('categoryId'));
  }

  submit(threadForm: NgForm) {
    const threadInfo: ThreadCreateModel = {
      title: threadForm.value.title,
      content: threadForm.value.content,
      categoryId: this.categoryId,
      isPinned: false,
      isLocked: false,
    };

    this.apiForumService.createThread(threadInfo).subscribe({
      next: () => this.router.navigate(['/category', this.categoryId]),
      error: err => {
        this.errorMessage = extractErrorMessage(err);
        this.cdr.detectChanges();
      }
    });
  }

  cancel() {
    this.router.navigate(['/category', this.categoryId]);
  }

}
