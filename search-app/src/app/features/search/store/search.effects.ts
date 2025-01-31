import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
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
      switchMap((action) =>
        this.searchService.search(action.query, action.page).pipe(
          map((result) => SearchActions.searchSuccess({ result })),
          catchError((error) => of(SearchActions.searchFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
