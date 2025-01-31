import { Book } from './book.model';

export interface SearchResult {
  total: string;
  books: Book[];
}

export interface SearchQuery {
  query: string;
  page: number;
}
