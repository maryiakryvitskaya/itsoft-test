import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SearchState } from './search.reducer';

export const selectSearchState = createFeatureSelector<SearchState>('SEARCH');

export const selectSearchResults = createSelector(selectSearchState, (state) => state.results?.books ?? []);

export const selectIsLoading = createSelector(selectSearchState, (state) => state.isLoading);
