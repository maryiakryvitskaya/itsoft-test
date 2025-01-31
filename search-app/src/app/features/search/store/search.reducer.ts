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
  on(SearchActions.searchSuccess, (state, { result, query }) => ({
    ...state,
    isLoading: false,
    results: {
      ...result,
      books: [...state.results.books, ...result.books],
    },
    pastQueries:
      result.books.length > 0 ? Array.from(new Set([query, ...state.pastQueries])).slice(0, 10) : state.pastQueries,
  })),
  on(SearchActions.searchFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(SearchActions.clearResults, (state) => ({
    ...state,
    results: { books: [], total: '0' }, 
  })),
);
export { SearchState };
