import { FormsModule } from '@angular/forms';
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
})

export class Searchbar {

  @Input() placeholder: string = 'Search...';
  @Output() onSearchClick = new EventEmitter<string>();

  searchValue: string = '';

  search() {
    this.onSearchClick.emit(this.searchValue);
  }
}
