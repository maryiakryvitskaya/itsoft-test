import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../configs/api.congig';
import { SearchResult } from '../models/search.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = API_CONFIG.apiUrl;

  constructor(private http: HttpClient) {}

  search(query: string, page: number): Observable<SearchResult> {
    return this.http.get<SearchResult>(`${this.apiUrl}${API_CONFIG.searchEndpoint}/${query}/${page}`);
  }
}
