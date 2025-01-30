import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchInputComponent, SearchResultsComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  private querySubject = new BehaviorSubject<string | null>(null);
  private destroy$ = new Subject<void>();

  query$ = this.querySubject.asObservable().pipe(
    takeUntil(this.destroy$),
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

  /**
   * After view init
   */

  ngAfterViewInit() {
    this.query$.subscribe((response) => {
      this.searchedItems = response.books ?? [];
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  // Event handler for search input change
  onSearchChange(query: string) {
    this.querySubject.next(query.trim() || null);
  }

  // Load more results when scrolling
  loadMore() {
    if (this.isLoading || !this.querySubject.value) return;

    this.isLoading = true;
    this.currentPage++;

    this.searchService
      .search(this.querySubject.value, this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.searchedItems = [...this.searchedItems, ...(response?.books ?? [])];
        this.isLoading = false;
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private search(query: string) {
    this.isLoading = true;
    return this.searchService.search(query, this.currentPage).pipe(
      finalize(() => (this.isLoading = false)),
      takeUntil(this.destroy$),
    );
  }

  private resetPagination() {
    this.currentPage = 1;
    this.searchedItems = [];
  }

  /**
   * On destroy
   */

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
