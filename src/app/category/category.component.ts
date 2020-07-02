import { Component, OnInit } from '@angular/core';
import { Category } from '../recipe/category';
import { CategoryService } from './category.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.categoryService.findAll().subscribe((categories: Category[]) => {
      this.ngxService.stop();
      this.categories = categories;
      this.categories.sort();
    });
  }
}