import { createAction, props } from '@ngrx/store';
import { SearchResult } from '../models/search.model';
import { Polygon } from '../../canvas/models/polygon.model';

export const searchBooks = createAction('[SEARCH] Search Books', props<{ query: string; page: number }>());

export const searchSuccess = createAction('[SEARCH] Search Success', props<{ result: SearchResult; query: string }>());

export const searchFailure = createAction('[SEARCH] Search Failure', props<{ error: string }>());

export const clearResults = createAction('[Search] Clear Results');

export const recordPastQuery = createAction('[SEARCH] Record Past Query', props<{ query: string }>());
