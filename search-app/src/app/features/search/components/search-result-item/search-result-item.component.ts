import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-search-result-item',
  standalone: true,
  imports: [],
  templateUrl: './search-result-item.component.html',
  styleUrl: './search-result-item.component.scss',
})
export class SearchResultItemComponent {
  @Input() item!: Book;
  @Output() openDialog = new EventEmitter<Book>();

  onSelect() {
    this.openDialog.emit(this.item);
  }
}
