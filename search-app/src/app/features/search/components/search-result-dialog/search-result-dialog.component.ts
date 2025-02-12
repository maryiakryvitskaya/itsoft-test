import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Book } from '../../models/book.model';

@Component({
  selector: 'app-search-result-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './search-result-dialog.component.html',
  styleUrl: './search-result-dialog.component.scss',
})
export class SearchResultDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SearchResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book,
  ) {}

  close() {
    this.dialogRef.close();
  }
}
