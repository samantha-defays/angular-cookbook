import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from './recipe';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient) {}

  findAll() {
    return this.http
      .get<Recipe[]>(environment.apiUrl + '/recipes')
      .pipe(map((data) => data['hydra:member'] as Recipe[]));
  }

  findOne(id: number) {
    return this.http.get<Recipe>(environment.apiUrl + '/recipes/' + id);
  }

  delete(id: number) {
    return this.http.delete<Recipe>(environment.apiUrl + '/recipes/' + id);
  }

  update(recipe: Recipe) {
    return this.http.put<Recipe>(
      environment.apiUrl + '/recipes/' + recipe.id,
      recipe
    );
  }

  create(recipe: Recipe) {
    return this.http.post<Recipe>(environment.apiUrl + '/recipes', recipe);
  }
}
