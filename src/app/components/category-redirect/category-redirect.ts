import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiForumService} from '../../services/api/api-forum.service';

@Component({
  selector: 'app-category-redirect',
  imports: [],
  templateUrl: './category-redirect.html',
  styleUrl: './category-redirect.css',
})
export class CategoryRedirect {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiForumService);

  ngOnInit() {
    const name = String(this.route.snapshot.data['categoryName'] ?? '').trim().toLowerCase();
    this.api.getCategories$().subscribe(cats => {
      const match = cats.find(c => c.name.trim().toLowerCase() === name);
      this.router.navigate(match ? ['/category', match.id] : ['/']);
    });
  }

}
