import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {ApiForumService} from '../../services/api/api-forum.service';
import {extractErrorMessage} from '../../services/api/error.util';

@Component({
  selector: 'app-category-redirect',
  imports: [RouterModule],
  templateUrl: './category-redirect.html',
  styleUrl: './category-redirect.css',
})
export class CategoryRedirect {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiForumService);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';

  ngOnInit() {
    const name = String(this.route.snapshot.data['categoryName'] ?? '').trim().toLowerCase();
    this.api.getCategories$().subscribe({
      next: cats => {
        const match = cats.find(c => c.name.trim().toLowerCase() === name);
        this.router.navigate(match ? ['/category', match.id] : ['/']);
      },
      error: (err) => {
        this.errorMessage = extractErrorMessage(err);
        this.cdr.detectChanges();
      }
    });
  }

}
