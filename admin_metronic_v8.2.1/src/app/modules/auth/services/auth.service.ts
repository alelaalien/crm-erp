import { EnvironmentInjector, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from 'src/app/config/config';
import { InactivityService } from './inactivity.service';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  token: any;
  user: any;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    
    private router: Router,
    private http: HttpClient,
    private inactivity: InactivityService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string):Observable<any>  {
    
    this.isLoadingSubject.next(true);

    const headers = new HttpHeaders({
    'Accept': 'application/json'
    });

    let URL = URL_SERVICE + "auth/login";
    
    return this.http.post(URL, {email, password}, {headers}).pipe(
      
      map((auth:any) => {
      
        const result = this.setAuthFromLocalStorage(auth);

        this.user = auth.user;
       
        return result;
      }), 
      catchError((err) => {
       
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }
 
  getUserByToken(): Observable<any> {
    this.user = this.getAuthFromLocalStorage();
    const auth = this.user;
     
    if (!auth) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return of(auth).pipe(
      map((user: any) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
 
  // need create new user then login
    registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.http.post( URL_SERVICE, user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return  this. forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
 
  // private methods
  private setAuthFromLocalStorage(auth: any): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes

    if (auth && auth.access_token) {
       
      localStorage.setItem("token", auth.access_token);
      localStorage.setItem("user", JSON.stringify(auth.user));
 
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem('user');
      if (!lsValue) {
        return undefined;
      }

      this.token = localStorage.getItem("token");
      this.user = JSON.parse(lsValue);
      const authData = this.user;

      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }  
}
