import { AfterViewInit, Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchInputComponent, SearchResultsComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements AfterViewInit {
  private querySubject = new BehaviorSubject<string>('');
  query$ = this.querySubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.resetPagination()),
    switchMap((query) => this.search(query)),
  );

  isLoading = false;
  searchedItems: any[] = [];
  batchSize = 10;
  currentPage = 1;

  constructor(private searchService: SearchService) {}

  ngAfterViewInit() {
    this.query$.subscribe((response) => {
      this.searchedItems = response?.books ?? [];
      this.isLoading = false;
    });
  }

  private search(query: string) {
    if (!query.trim()) return of({ books: [] });

    this.isLoading = true;
    return this.searchService.search(query, this.currentPage).pipe(finalize(() => (this.isLoading = false)));
  }

  onSearchChange(query: string) {
    this.querySubject.next(query);
  }

  loadMore() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.currentPage++;

    this.searchService.search(this.querySubject.value, this.currentPage).subscribe((response) => {
      this.searchedItems = [...this.searchedItems, ...(response?.books ?? [])];
      this.isLoading = false;
    });
  }

  private resetPagination() {
    this.currentPage = 1;
    this.searchedItems = [];
  }
}
