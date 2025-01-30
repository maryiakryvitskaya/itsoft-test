import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {
  query = '';
  @Output() queryChange = new EventEmitter<string>();

  onSearchChange(query: string) {
    this.queryChange.emit(query);
  }
}
