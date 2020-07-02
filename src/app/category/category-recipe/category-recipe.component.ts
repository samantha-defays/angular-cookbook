import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/recipe/recipe';
import { RecipeService } from 'src/app/recipe/recipe.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/auth/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-recipe',
  templateUrl: './category-recipe.component.html',
  styleUrls: ['./category-recipe.component.css'],
})
export class CategoryRecipeComponent implements OnInit {
  recipes: Recipe[] = [];
  userId: number;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private recipeService: RecipeService,
    private ngxService: NgxUiLoaderService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();

    this.userId = this.authService.getIdFromToken();

    this.recipeService.findAll().subscribe(
      (recipes) => {
        // réussite
        this.ngxService.stop();
        recipes.forEach((recipe) => {
          if (recipe.owner.search(this.userId) === -1) {
            return;
          }
          this.recipes.push(recipe);
        });
        this.recipes.reverse();
      },
      (error) => {
        // erreur
        this.ngxService.stop();
        this.toastr.warning(
          "Nous n'avons pas pu charger les recettes",
          'Erreur'
        );
      }
    );
  }

  getRecipesForCurrentPage(): Recipe[] {
    const startIndex = (this.currentPage - 1) * 10;

    return this.recipes.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
