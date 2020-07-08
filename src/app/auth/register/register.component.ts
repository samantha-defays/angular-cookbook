import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    photo: new FormControl(''),
    password: new FormControl('', Validators.required),
  });
  submitted = false;
  error = false;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  handleSubmit() {
    this.ngxService.start();
    this.submitted = true;

    if (this.form.invalid) {
      this.ngxService.stop();
      this.error = true;
      return;
    }

    this.userService.create(this.form.value).subscribe(
      (data) => {
        // Inscription réussie
        this.ngxService.stop();
        this.toastr.success('Votre inscription a bien été validée !');
        this.error = false;

        this.router.navigateByUrl('/login');
      },
      (error: HttpErrorResponse) => {
        // Echec de l'inscription
        this.ngxService.stop();

        //1. Une erreur 400 avec des violations
        if (error.status === 400 && error.error.violations) {
          for (const violation of error.error.violations) {
            const nomDuChamp = violation.propertyPath;
            const message = violation.message;

            this.form.controls[nomDuChamp].setErrors({
              invalid: message,
            });
          }
          this.error = false;
          this.toastr.warning(
            'Nous avons rencontré un problème',
            "Echec de l'inscription"
          );

          return;
        }
        //2. Toute autre type d'erreur
        this.error = true;
        this.toastr.warning(
          'Nous avons rencontré un problème',
          "Echec de l'inscription"
        );
      }
    );
  }
}
