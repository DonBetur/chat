import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import jwt_decode from 'jwt-decode';

import { environment } from 'src/environments/environment';

import { NewUser } from '../models/newUser.model';
import { Role, User } from '../models/user.model';
import { UserResponse } from '../models/userResponse.model';
import { ChatStateService } from 'src/app/home/services/chat-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(null);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  get userStream(): Observable<User> {
    return this.user$.asObservable();
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable()
			.pipe(
				switchMap((user: User) => {
					const isUserAuthenticated = user !== null;
					return of(isUserAuthenticated);
				})
			);
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable()
			.pipe(
				switchMap((user: User) => of(user?.role)) // for after signed out, but still subscribed
			);
  }

  get userId(): Observable<number> {
    return this.user$.asObservable()
			.pipe(
				switchMap((user: User) => of(user.id))
			);
  }

  get userFullName(): Observable<string> {
    return this.user$.asObservable()
			.pipe(
				switchMap((user: User) => {
					if (!user) {
						return of(null);
					}
					const fullName = user.firstName + ' ' + user.lastName;
					return of(fullName);
				})
			);
  }

	get syncUser(): User {
		return this.user$.value;
	}

  // get userFullImagePath(): Observable<string> {
  //   return this.user$.asObservable().pipe(
  //     switchMap((user: User) => {
  //       const doesAuthorHaveImage = !!user?.imagePath;
  //       console.log(888, doesAuthorHaveImage, user);
  //       let fullImagePath = this.getDefaultFullImagePath();
  //       if (doesAuthorHaveImage) {
  //         fullImagePath = this.getFullImagePath(user.imagePath);
  //       }
  //       return of(fullImagePath);
  //     })
  //   );
  // }

  constructor(
		private http: HttpClient,
		private router: Router
	) {}

  // getDefaultFullImagePath(): string {
  //   return 'http://localhost:3000/api-chat/feed/images/blank-profile-picture.png';
  // }

  // getFullImagePath(imageName: string): string {
  //   return 'http://localhost:3000/api-chat/feed/image/' + imageName;
  // }

  // getUserImage() {
  //   return this.http.get(`${environment.baseApiUrl}/user/images`).pipe(take(1));
  // }

  // getUserImageName(): Observable<{ imageName: string }> {
  //   return this.http
  //     .get<{ imageName: string }>(`${environment.baseApiUrl}/user/image-name`)
  //     .pipe(take(1));
  // }

  // updateUserImagePath(imagePath: string): Observable<User> {
  //   return this.user$.pipe(
  //     take(1),
  //     map((user: User) => {
  //       user.imagePath = imagePath;
  //       this.user$.next(user);
  //       return user;
  //     })
  //   );
  // }

  // uploadUserImage(
  //   formData: FormData
  // ): Observable<{ modifiedFileName: string }> {
  //   return this.http
  //     .post<{ modifiedFileName: string }>(
  //       `${environment.baseApiUrl}/user/upload`,
  //       formData
  //     )
  //     .pipe(
  //       tap(({ modifiedFileName }) => {
  //         let user = this.user$.value;
  //         user.imagePath = modifiedFileName;
  //         this.user$.next(user);
  //       })
  //     );
  // }

	/**
	 * Автоматический логин и редирект на /home при успешной регистрации
	 */
  register(newUser: NewUser): Observable<User> {
    return this.http.post<User>(
        `${environment.baseApiUrl}/auth/register`,
        newUser,
        this.httpOptions
      )
      .pipe(
				switchMap(() => this.login(newUser.email, newUser.password)),
				take(1)
			);
  }

	/**
	 * Автоматический  редирект на /home при успешной авторизации
	 */
  login(email: string, password: string): Observable<User> {
    return this.http.post<{ token: string }>(
        `${environment.baseApiUrl}/auth/login`,
        { email, password },
        this.httpOptions
      )
      .pipe(
        map((response: { token: string }) => {
         Storage.set({
            key: 'token',
            value: response.token,
          });
          const decodedToken: UserResponse = jwt_decode(response.token);
          this.user$.next(decodedToken.user);
					this.router.navigateByUrl('/home');

					return decodedToken.user;
        }),
				take(1)
      );
  }

  isTokenInStorage(): Observable<boolean> {
    return from(
      Storage.get({
        key: 'token',
      })
    ).pipe(
      map((data: { value: string }) => {
        if (!data || !data.value) return null;

        const decodedToken: UserResponse = jwt_decode(data.value);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) return null;
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
          return true;
        }
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    Storage.remove({ key: 'token' });
    this.router.navigateByUrl('/auth');
		location.reload();
  }
}
