import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { Observable, Subject, debounceTime, distinctUntilChanged, filter, take, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import * as SearchActions from './store/search.actions';
import { AsyncPipe } from '@angular/common';
import { Book } from './models/book.model';
import { selectIsLoading, selectSearchResults } from './store/search.selectors';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchInputComponent, SearchResultsComponent, AsyncPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  private querySubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private lastQuery: string | null = null;

  query$ = this.querySubject.asObservable().pipe(
    takeUntil(this.destroy$),
    filter((query) => !!query.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    tap((query) => {
      this.lastQuery = query;
      this.resetPagination();
    }),
  );

  searchResults$: Observable<Book[]>;
  isLoading$: Observable<boolean>;
  currentPage = 1;

  constructor(private store: Store) {
    this.searchResults$ = this.store.select(selectSearchResults);
    this.isLoading$ = this.store.select(selectIsLoading);
  }

  /**
   * After view init
   */

  ngAfterViewInit() {
    this.query$.subscribe((query) => {
      this.store.dispatch(SearchActions.searchBooks({ query, page: 1 }));
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  // Event handler for search input change
  onSearchChange(query: string) {
    // Update the query in the subject to trigger further actions
    this.querySubject.next(query);

    // If the query is empty, clear the results
    if (!query.trim()) {
      this.store.dispatch(SearchActions.clearResults());
    } else {
      // If the query is not empty, dispatch an action to search
      this.store.dispatch(SearchActions.searchBooks({ query, page: 1 }));
    }
  }

  // Load more results when scrolling
  loadMore() {
    if (!this.lastQuery) return;

    this.store
      .select(selectIsLoading)
      .pipe(
        take(1),
        filter((isLoading) => !isLoading),
        tap(() => this.currentPage++),
        tap(() => {
          this.store.dispatch(
            SearchActions.searchBooks({
              query: this.lastQuery!,
              page: this.currentPage,
            }),
          );
        }),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private resetPagination() {
    this.currentPage = 1;
  }

  /**
   * On destroy
   */

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
