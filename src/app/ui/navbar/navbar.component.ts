import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();

    this.auth.authChanged.subscribe((value) => {
      if (!value && this.isAuthenticated) {
        // this.toastr.warning(
        //   'Votre session a expiré, veuillez vous reconnecter'
        // );
        this.router.navigateByUrl('/login');
      }
      this.isAuthenticated = value;
    });
  }

  handleLogout() {
    this.auth.logout();
    this.toastr.success('Vous avez bien été déconnecté.');
    this.router.navigateByUrl('/login');
  }
}
