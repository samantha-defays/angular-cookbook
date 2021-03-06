import { Component, OnInit } from '@angular/core';
import { Category } from '../recipe/category';
import { CategoryService } from './category.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  route$: Observable<any>;
  selectedCategory: boolean;

  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ngxService.start();

    this.categoryService.findAll().subscribe((categories: Category[]) => {
      this.ngxService.stop();
      this.categories = categories;
      this.categories.sort();
    });

    this.route$ = this.route.paramMap.pipe(
      switchMap((params) => {
        if (+params.get('id') == null) {
          this.selectedCategory = false;
        }
      })
    );
  }
}
