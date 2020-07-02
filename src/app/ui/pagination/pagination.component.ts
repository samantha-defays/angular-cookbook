import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input()
  currentPage = 1;

  @Input()
  itemsPerPage = 10;

  @Input()
  items: number;

  @Output()
  pageChanged = new EventEmitter<number>();

  pages = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.items) {
      return;
    }
    const pagesCount = Math.ceil(this.items / this.itemsPerPage);

    this.pages = [];
    for (let i = 1; i <= pagesCount; i++) {
      this.pages.push(i);
    }
  }

  handlePageClick(pageNumber: number) {
    this.pageChanged.emit(pageNumber);
  }
}
