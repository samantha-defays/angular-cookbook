import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Category } from '../category';
import { Recipe } from '../recipe';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../category/category.service';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Votre texte ici',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
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
        'toggleEditorMode',
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
    this.categoryService.findAll().subscribe((categories) => {
      this.recipeCategories = categories;
      this.recipeCategories.sort();
      this.addCheckboxes();
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

  handleSubmit() {
    this.ngxService.start();
    this.submitted = true;

    if (this.form.invalid) {
      this.ngxService.stop();
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
          this.ngxService.stop();
          this.toastr.success('Recette enregistrée !');
          this.router.navigateByUrl('/recipes');
        },
        (error) => {
          // échec de la création
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
