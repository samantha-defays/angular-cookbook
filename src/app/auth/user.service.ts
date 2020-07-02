import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  id: number;

  constructor(private http: HttpClient, private auth: AuthService) {}

  find(id: number) {
    return this.http.get<User>(environment.apiUrl + '/users/' + id);
  }

  update(user: User) {
    return this.http.put<User>(environment.apiUrl + '/users/' + user.id, user);
  }

  create(user: User) {
    return this.http.post<User>(environment.apiUrl + '/users', user);
  }

  getId() {
    return (this.id = this.auth.getIdFromToken());
  }
}
