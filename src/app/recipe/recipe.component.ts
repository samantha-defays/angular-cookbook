import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe';
import { RecipeService } from './recipe.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  recipes: Recipe[] = [];
  currentPage = 1;
  itemsPerPage = 9;

  constructor(
    private recipeService: RecipeService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.recipeService.findAll().subscribe((recipes: Recipe[]) => {
      this.ngxService.stop();
      this.recipes = recipes;
      this.recipes.reverse();
    });
  }

  getRecipesForCurrentPage(): Recipe[] {
    const startIndex = (this.currentPage - 1) * 10;

    return this.recipes.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
