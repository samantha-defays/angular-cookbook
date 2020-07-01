import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  submitted = false;
  error = false;
  fullName = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  handleSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.auth.authenticate(this.form.value).subscribe(
      (data) => {
        // Authentification réussie
        this.error = false;
        this.router.navigateByUrl('/');
      },
      (error) => {
        // Gestion de l'échec de l'authentification
        this.error = true;
        this.toastr.warning(
          "Il semble qu'il y ait eu une erreur lors de la connexion"
        );
      }
    );
  }
}
