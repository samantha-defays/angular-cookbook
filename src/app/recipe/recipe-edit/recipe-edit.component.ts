import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Recipe } from '../recipe';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from '../category';
import { CategoryService } from '../../category/category.service';
import { map, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  recipeCategories: Category[] = [];
  categories$: Observable<Category[]>;
  selectedCategories = [];
  recipe: Recipe;
  submitted = false;

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    ingredients: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    preparationTime: new FormControl(),
    cookingTime: new FormControl(),
    utensils: new FormControl(''),
    illustration: new FormControl(''),
    categories: new FormArray([]),
  });

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '120px',
    minHeight: '200',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Votre texte ici',
    defaultParagraphSeparator: '',
    defaultFontName: 'Cambo',
    defaultFontSize: '',
    fonts: [
      { class: 'cambo', name: 'Cambo' },
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'strikeThrough',
        'superscript',
        'subscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'indent',
        'outdent',
        'fontName',
      ],
      [
        'fontSize',
        'backgroundColor',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'customClasses',
        'link',
        'unlink',
        'removeFormat',
      ],
    ],
  };

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.categories$ = this.categoryService.findAll();
    this.categories$.subscribe((categories) => {
      this.recipeCategories = categories;
      this.addCheckboxes();
    });

    this.route.paramMap
      .pipe(
        map((params) => +params.get('id')),
        switchMap((id) => this.recipeService.findOne(id)),
        map((recipe) => {
          return {
            ...recipe,
          };
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
        this.recipe.categories.forEach((control, i) => {
          this.selectedCategories.push(
            `api/categories/${this.recipe.categories[i].id}`
          );
        });
        this.form.patchValue(this.recipe);
        this.ngxService.stop();
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

  hasCategory(name: string) {
    const found = this.recipe.categories.find(
      (name) => this.recipe.categories.name === name
    );

    if (!found) {
      return false;
    }
    return true;
  }

  handleSubmit() {
    this.ngxService.start();
    this.submitted = true;

    if (this.form.invalid) {
      this.ngxService.stop();
      return;
    }

    this.recipeService
      .update({
        ...this.recipe,
        ...this.form.value,
        categories: [...this.selectedCategories],
      })
      .subscribe(
        (recipe) => {
          // succes
          this.ngxService.stop();
          this.toastr.success('Recette modifiée !');
          this.router.navigateByUrl('/recipes');
        },
        (error) => {
          // error
          this.ngxService.stop();
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
