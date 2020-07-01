import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/auth/user.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  submitted = false;
  user: User;
  newUser: User;
  form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    photo: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.userService.getId();
    this.userService.find(id).subscribe((user) => {
      this.user = user;
      this.form.patchValue({ ...this.user, password: '' });
    });
  }

  format;

  handleSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (!this.form.value.password) {
      // si le mot de passe reste inchangé
      this.newUser = {
        ...this.user,
        ...this.form.value,
        password: this.user.password,
      };
    } else {
      // s'il a été modifié
      this.newUser = {
        ...this.user,
        ...this.form.value,
      };
    }

    this.userService.update(this.newUser).subscribe(
      (user) => {
        // réussite
        this.toastr.success('Votre profil a bien été mis à jour');
        this.router.navigateByUrl('/profile');
      },
      (error) => {
        // erreur
        this.toastr.warning(
          "Il y a eu un problème, nous n'avons pas pu modifier votre profil"
        );
      }
    );
  }
}