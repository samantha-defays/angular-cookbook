import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Category } from '../category';
import { Recipe } from '../recipe';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css'],
})
export class RecipeCreateComponent implements OnInit {
  recipeCategories: Category[] = [];
  submitted = false;
  selectedCategories = [];

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    ingredients: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    preparationTime: new FormControl(0),
    cookingTime: new FormControl(0),
    utensils: new FormControl(''),
    illustration: new FormControl(''),
    categories: new FormArray([]),
  });

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categoryService.findAll().subscribe((categories) => {
      this.recipeCategories = categories;
      this.addCheckboxes();
    });
  }

  addCheckboxes() {
    this.recipeCategories.forEach(() => {
      const control = new FormControl(false);
      this.categories.push(control);
    });
  }

  get categories() {
    return this.form.controls['categories'] as FormArray;
  }

  getSelectedCategories() {
    this.selectedCategories = [];
    this.categories.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedCategories.push(
          `api/categories/${this.recipeCategories[i].id}`
        );
      }
    });
  }

  handleSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.recipeService
      .create({
        ...this.form.value,
        categories: [...this.selectedCategories],
      })
      .subscribe(
        (recipe) => {
          // réussite de l'enregistrement
          this.toastr.success('Recette enregistrée !');
          this.router.navigateByUrl('/recipes');
        },
        (error) => {
          // échec de la création
          if (error.status === 400 && error.error.violations) {
            for (const violation of error.error.violations) {
              const nomDuChamp = violation.propertyPath;
              const message = violation.message;

              this.form.controls[nomDuChamp].setErrors({ invalid: message });
            }
            return;
          }
          this.toastr.warning(
            "Impossible d'enregistrer la recette",
            'Il y a eu un problème'
          );
        }
      );
  }
}
