import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [ScrollingModule, NgIf],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
  @Input() searchedItems: any[] = [];
  @Input() isLoading: boolean = false;
  @Output() loadMore = new EventEmitter<void>();

  itemsPerPage: number = 10;

  nextBatch(index: number) {
    if (index + this.itemsPerPage >= this.searchedItems.length) {
      this.loadMore.emit();
    }
  }
}
