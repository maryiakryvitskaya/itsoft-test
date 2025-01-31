import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSuggestedQueries } from '../../store/search.selectors';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, AsyncPipe, NgFor, NgIf],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  query = '';
  showSuggestions = false;

  @Output() queryChange = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  suggestedQueries$: Observable<string[]>;

  constructor(private store: Store) {
    this.suggestedQueries$ = this.store.select(selectSuggestedQueries);
  }

  onSearchChange(query: string) {
    this.queryChange.emit(query);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.searchInput.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
    }
  }

  selectSuggestion(suggestion: string) {
    this.query = suggestion;
    this.showSuggestions = false;
    this.onSearchChange(suggestion);
  }
}
