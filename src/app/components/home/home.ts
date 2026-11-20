import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {ApiForumService} from '../../services/api/api-forum.service';
import {ThreadCategory} from '../../models/thread-category';
import {RouterModule} from '@angular/router';
import {extractErrorMessage} from '../../services/api/error.util';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private apiForumService = inject(ApiForumService);
  private cdr = inject(ChangeDetectorRef);

  categories: ThreadCategory[] = [];
  errorMessage = '';

  ngOnInit() {
    this.apiForumService.getCategories$().subscribe({
      next: data => {
        this.categories = data;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMessage = extractErrorMessage(err);
        this.cdr.detectChanges();
      }
    });
  }

}
