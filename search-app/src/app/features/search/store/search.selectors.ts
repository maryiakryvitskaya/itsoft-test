import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SearchState } from './search.reducer';

export const selectSearchState = createFeatureSelector<SearchState>('SEARCH');

export const selectSearchResults = createSelector(selectSearchState, (state) => state.results?.books ?? []);

export const selectIsLoading = createSelector(selectSearchState, (state) => state.isLoading);

export const selectPastQueries = createSelector(selectSearchState, (state) => state.pastQueries);

export const selectSuggestedQueries = createSelector(selectPastQueries, (queries) => {
  const words = queries.flatMap((q) => q.split(' ').map((word) => word.toLowerCase().trim()));

  const uniqueWords = Array.from(new Set(words));

  return [...new Set([...queries, ...uniqueWords])].slice(0, 15);
});
