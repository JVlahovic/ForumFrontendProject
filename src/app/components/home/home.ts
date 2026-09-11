import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {ApiForumService} from '../../services/api/api-forum.service';
import {ThreadCategory} from '../../models/thread-category';
import {RouterModule} from '@angular/router';

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

  ngOnInit() {
    this.apiForumService.getCategories$().subscribe({
      next: data => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: err => console.error('Category fetch failure!', err)
    });
  }

}
