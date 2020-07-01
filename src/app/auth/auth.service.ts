import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { Subject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChanged = new Subject<boolean>();

  constructor(private http: HttpClient) {
    interval(5000).subscribe(() => {
      this.authChanged.next(this.isAuthenticated());
    });
  }

  authenticate(credentials: Credentials) {
    return this.http
      .post(environment.apiUrl + '/login_token', credentials)
      .pipe(
        tap((data: { token: string }) => {
          // stockage du JWT Token dans le local storage
          window.localStorage.setItem('token', data.token);
        })
      );
  }

  getToken() {
    return window.localStorage.getItem('token');
  }

  isAuthenticated() {
    const token = window.localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const data = jwtDecode(token);

    return data.exp * 1000 > Date.now();
  }

  getIdFromToken() {
    if (!this.isAuthenticated) {
      return;
    }
    const token = this.getToken();

    const data = jwtDecode(token);
    return data.id;
  }

  logout() {
    window.localStorage.removeItem('token');
  }
}

export interface Credentials {
  username: string;
  password: string;
}
