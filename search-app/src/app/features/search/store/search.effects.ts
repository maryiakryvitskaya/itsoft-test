import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearchService } from '../services/search.service';
import * as SearchActions from './search.actions';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private searchService: SearchService,
  ) {}

  searchBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.searchBooks),
      debounceTime(1000),
      switchMap(({ query, page }) =>
        this.searchService.search(query, page).pipe(
          map((result) => SearchActions.searchSuccess({ result, query })),
          catchError((error) => of(SearchActions.searchFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
