import { createAction, props } from '@ngrx/store';
import { SearchResult } from '../models/search.model';

export const searchBooks = createAction(
  '[SEARCH] Search Books',
  props<{ query: string; page: number }>()
);

export const searchSuccess = createAction(
  '[SEARCH] Search Success',
  props<{ result: SearchResult }>()
);

export const searchFailure = createAction(
  '[SEARCH] Search Failure',
  props<{ error: string }>()
);