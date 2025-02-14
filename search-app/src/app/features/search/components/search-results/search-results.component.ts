import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgIf } from '@angular/common';
import { Book } from '../../models/book.model';
import { SearchResultItemComponent } from '../search-result-item/search-result-item.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchResultDialogComponent } from '../search-result-dialog/search-result-dialog.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [ScrollingModule, NgIf, SearchResultItemComponent, SearchResultDialogComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
  @Input() searchedItems: Book[] = [];
  @Input() isLoading: boolean = false;
  @Output() loadMore = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {}

  itemsPerPage: number = 10;

  nextBatch(index: number) {
    if (index + this.itemsPerPage >= this.searchedItems.length) {
      this.loadMore.emit();
    }
  }

  openDialog(item: Book) {
    this.dialog.open(SearchResultDialogComponent, {
      minWidth: '90%',
      height: '90%',
      data: item,
    });
  }
}
