import { AfterViewInit, Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, finalize, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchInputComponent, SearchResultsComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements AfterViewInit {
  private querySubject = new BehaviorSubject<string | null>(null);
  query$ = this.querySubject.asObservable().pipe(
    filter((query): query is string => !!query?.trim()),
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
      this.searchedItems = response.books ?? [];
    });
  }

  private search(query: string) {
    this.isLoading = true;
    return this.searchService.search(query, this.currentPage).pipe(finalize(() => (this.isLoading = false)));
  }

  onSearchChange(query: string) {
    this.querySubject.next(query.trim() || null);
  }

  loadMore() {
    if (this.isLoading || !this.querySubject.value) return;

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
