import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from './category';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Category[]> {
    return this.http
      .get<Category[]>(environment.apiUrl + '/categories')
      .pipe(map((data) => data['hydra:member'] as Category[]));
  }
}
