import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

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

  logout() {
    window.localStorage.removeItem('token');
  }
}

export interface Credentials {
  username: string;
  password: string;
}
