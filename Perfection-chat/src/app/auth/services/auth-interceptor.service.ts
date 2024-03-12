import {
	HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {

	constructor(
		private readonly router: Router
	) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(
      Storage.get({
        key: 'token',
      })
    ).pipe(
      switchMap((data: { value: string }) => {
        const token = data?.value;
        if (token) {
          const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token),
          });
          return next.handle(clonedRequest);
        }
        return next.handle(req);
      }),
			catchError((err) => {
				if (err instanceof HttpErrorResponse && err.status === 401) {
					console.error('Unauthorized error');
					this.router.navigateByUrl('/auth');
					location.reload();
					return throwError(() => err);
				} else {
					console.log('Непредвиденная ошибка при http запросе');
					return throwError(() => err);
				}
			})
    );
  }
}
