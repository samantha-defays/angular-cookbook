import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RecipeComponent } from './recipe/recipe.component';
import { ProfileComponent } from './profile/profile.component';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe/recipe-edit/recipe-edit.component';
import { RecipeCreateComponent } from './recipe/recipe-create/recipe-create.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: RecipeComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'profile/edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'recipes', component: RecipeComponent, canActivate: [AuthGuard] },
  {
    path: 'recipes/create',
    component: RecipeCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recipes/edit/:id',
    component: RecipeEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recipes/view/:id',
    component: RecipeDetailComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
