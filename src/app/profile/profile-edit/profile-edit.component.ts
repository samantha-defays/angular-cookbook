import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/auth/user.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  submitted = false;
  error = false;
  user: User;
  newUser: User;
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    photo: new FormControl(''),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();

    // récupération de l'ID de l'utilisateur connecté
    const id = this.userService.getId();

    // remplissage des informations de l'utilisateur
    this.userService.find(id).subscribe((user) => {
      this.user = user;
      this.form.patchValue({ ...this.user, password: '' });
      this.ngxService.stop();
    });
  }

  handleSubmit() {
    this.ngxService.start();
    this.submitted = true;

    if (this.form.invalid) {
      this.ngxService.stop();
      this.error = true;
      return;
    }

    this.newUser = {
      ...this.user,
      ...this.form.value,
    };

    this.userService.update(this.newUser).subscribe(
      (user) => {
        // réussite
        this.ngxService.stop();
        this.error = false;
        this.toastr.success('Votre profil a bien été mis à jour');
        this.router.navigateByUrl('/profile/edit');
      },
      (error) => {
        // erreur
        this.ngxService.stop();
        this.error = true;
        if (error.status === 400 && error.error.violations) {
          for (const violation of error.error.violations) {
            const nomDuChamp = violation.propertyPath;
            const message = violation.message;

            this.form.controls[nomDuChamp].setErrors({ invalid: message });
          }
          this.toastr.warning(
            "Il y a eu un problème, nous n'avons pas pu modifier votre profil"
          );
          return;
        }
        this.toastr.warning(
          "Il y a eu un problème, nous n'avons pas pu modifier votre profil"
        );
      }
    );
  }
}
