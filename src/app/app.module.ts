import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RecipeComponent } from './recipe/recipe.component';
import { ProfileComponent } from './profile/profile.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RecipeEditComponent } from './recipe/recipe-edit/recipe-edit.component';
import { RecipeCreateComponent } from './recipe/recipe-create/recipe-create.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RecipeComponent,
    ProfileComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RecipeCreateComponent,
    ProfileEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
