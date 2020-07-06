import { Component, OnInit, OnChanges } from '@angular/core';
import { Recipe } from 'src/app/recipe/recipe';
import { RecipeService } from 'src/app/recipe/recipe.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/auth/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../category.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-recipe',
  templateUrl: './category-recipe.component.html',
  styleUrls: ['./category-recipe.component.css'],
})
export class CategoryRecipeComponent implements OnInit {
  recipes$: Observable<any>;
  recipes: Recipe[] = [];
  categoryId: number;
  userId: number;

  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.userId = this.authService.getIdFromToken();

    this.recipes$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.categoryId = +params.get('id');
        this.ngxService.start();
        return this.categoryService.find(this.categoryId);
      })
    );

    this.recipes$.subscribe(
      (category) => {
        // réussite
        this.recipes = [];
        category.recipes.forEach((recipe) => {
          if (recipe.owner.search(this.userId) === -1) {
            return;
          }
          this.recipes.push(recipe);
        });
        this.recipes.reverse();
        this.ngxService.stop();
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
