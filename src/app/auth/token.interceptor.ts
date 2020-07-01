import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { retry, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.auth.isAuthenticated()) {
      return next.handle(request).pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';

          // si le token est expiré
          if (error.status === 401 && window.localStorage.getItem('token')) {
            errorMessage = `Error: ${error.status}`;

            this.toastr.error(
              'Votre session a expiré, merci de vous reconnecter.'
            );
            this.router.navigateByUrl('/login');
          }
          return throwError(errorMessage);
        })
      );
    }

    const requestCopy = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.auth.getToken(),
      },
    });
    return next.handle(requestCopy);
  }
}
