import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearchService } from '../services/search.service';
import * as SearchActions from './search.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private searchService: SearchService,
    private store: Store,
  ) {}

  searchBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.searchBooks),
      debounceTime(1000),
      switchMap(({ query, page }) =>
        this.searchService.search(query, page).pipe(
          map((result) => SearchActions.searchSuccess({ result, query })),
          tap((action) => {
            if (action.result.books?.length > 0) {
              this.store.dispatch(SearchActions.recordPastQuery({ query: action.query }));
            }
          }),
          catchError((error) => of(SearchActions.searchFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
