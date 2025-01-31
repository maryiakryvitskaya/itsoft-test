import { createReducer, on } from '@ngrx/store';
import * as SearchActions from './search.actions';
import { SearchState, initialState } from './search.state';

export const searchReducer = createReducer<SearchState>(
  initialState,
  on(SearchActions.searchBooks, (state, { query, page }) => ({
    ...state,
    query,
    page,
    isLoading: true,
    error: null,
  })),
  on(SearchActions.searchSuccess, (state, { result }) => ({
    ...state,
    isLoading: false,
    results: result,
  })),
  on(SearchActions.searchFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
);
