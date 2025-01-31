import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgIf } from '@angular/common';
import { SearchResult } from '../../models/search.model';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [ScrollingModule, NgIf],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
  @Input() searchedItems: Book[] = [];
  @Input() isLoading: boolean = false;
  @Output() loadMore = new EventEmitter<void>();

  itemsPerPage: number = 10;

  nextBatch(index: number) {
    if (index + this.itemsPerPage >= this.searchedItems.length) {
      this.loadMore.emit();
    }
  }
}
