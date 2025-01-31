import { SearchResult } from '../models/search.model';

export interface SearchState {
  query: string;
  page: number;
  isLoading: boolean;
  results: SearchResult;
  error: string | null;
}

export const initialState: SearchState = {
  query: '',
  page: 1,
  isLoading: false,
  results: { total: '0', books: [] },
  error: null,
};
