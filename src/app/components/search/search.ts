import {ChangeDetectorRef, Component, DestroyRef, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ApiForumService} from '../../services/api/api-forum.service';
import {ThreadRead} from '../../models/thread-read';
import {extractErrorMessage} from '../../services/api/error.util';

@Component({
  selector: 'app-search',
  imports: [RouterModule, DatePipe],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

  private apiForumService = inject(ApiForumService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  searchTerm = '';
  groupedResults: {categoryName: string; threads: ThreadRead[]}[] = [];
  searched = false;
  errorMessage = '';

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const q = String(params['q'] ?? '').trim();
        this.searchTerm = q;
        if (q) {
          this.runSearch(q);
        } else {
          this.groupedResults = [];
          this.searched = false;
          this.cdr.detectChanges();
        }
      });
  }

  private runSearch(title: string) {
    this.errorMessage = '';
    this.apiForumService.searchThreads$(title).subscribe({
      next: data => {
        this.groupedResults = this.group(data);
        this.searched = true;
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMessage = extractErrorMessage(err);
        this.cdr.detectChanges();
      }
    });
  }

  private group(threads: ThreadRead[]): {categoryName: string; threads: ThreadRead[]}[] {
    const map = new Map<string, ThreadRead[]>();
    for (const t of threads) {
      const key = t.threadCategoryName ?? 'Uncategorized';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map, ([categoryName, threads]) => ({categoryName, threads}))
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }
}
