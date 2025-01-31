import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSuggestedQueries } from '../../store/search.selectors';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, AsyncPipe, NgFor],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  query = '';
  @Output() queryChange = new EventEmitter<string>();

  suggestedQueries$: Observable<string[]>;

  constructor(private store: Store) {
    this.suggestedQueries$ = this.store.select(selectSuggestedQueries);
  }

  onSearchChange(query: string) {
    this.queryChange.emit(query);
  }
}
