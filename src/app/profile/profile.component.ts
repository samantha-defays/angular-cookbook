import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user';
import { UserService } from '../auth/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    const id = this.userService.getId();

    this.userService.find(id).subscribe((user) => {
      this.user = user;
      this.ngxService.stop();
    });
  }
}
