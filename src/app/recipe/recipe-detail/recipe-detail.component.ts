import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        switchMap((id) => this.recipeService.findOne(+id))
      )
      .subscribe(
        (recipe) => {
          this.recipe = recipe;
          this.ngxService.stop();
        },
        (error) => {
          // gestion de l'erreur si la recette n'existe pas
          this.ngxService.stop();
          this.toastr.warning("La recette demandée n'a pas pu être trouvée");
          this.router.navigateByUrl('/recipes');
        }
      );
  }

  handleDelete(r: Recipe) {
    this.ngxService.start();
    this.recipeService.delete(r.id).subscribe(
      () => {
        this.ngxService.stop();
        this.toastr.success('La recette a bien été supprimée', 'Succès !');
        this.router.navigateByUrl('/recipes');
      },
      (error) => {
        this.ngxService.stop();
        this.toastr.warning(
          'Echec de la suppression',
          'Une erreur est survenue'
        );
      }
    );
  }
}
