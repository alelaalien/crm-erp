import { EnvironmentInjector, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user.model'; 
import { AuthModel } from '../../modules/auth/models/auth.model';
import { AuthHTTPService } from '../../modules/auth/services/auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from 'src/app/config/config';
import { InactivityService } from '../../modules/auth/services/inactivity.service';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  
  private userSubject = new BehaviorSubject<UserType>(undefined);
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public currentUser$ =  this.userSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public token: any;
  public user: any;
 
  
  get currentUserValue(): UserType {
    return this.userSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.userSubject.next(user);
  }

  constructor(
    
    private router: Router,
    private http: HttpClient,
    private inactivity: InactivityService
  ) {
    
    
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
    
    return this.http.post(URL, {email, password}).pipe(
      
      map((auth:any) => {
      
        localStorage.setItem("token", auth.access_token);
        localStorage.setItem("user", JSON.stringify(auth.user));

        this.userSubject.next(auth.user)
       
        
        return auth;
      }), 
      catchError((err) => {
       
        return of(err);
      }),
      finalize(() => {this.hasPermission("");this.isLoadingSubject.next(false);  } )
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
          this.userSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  
  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return  this. forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
  
  private setAuthFromLocalStorage(auth: any): boolean { 

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
 
 /*  
  
  //console.group('🔍 Depuración de Auth');//
  console.log('Usuario actual en el Subject:', user);
  
}*/

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }  
  //el permiso
  hasPermission(permission: string): boolean {
    if( this.isSuperAdmin()) return true;
    const user = this.currentUserValue;
    return user?.permissions?.includes(permission) || false;
  }

 //AL MENOS UNO 
  hasAnyPermission(permissions: string[]): boolean {
    if( this.isSuperAdmin()) return true;

    return permissions.some(p => this.hasPermission(p));
  }

  //  TODOS los permisos  
  hasAllPermissions(permissions: string[]): boolean {
    if( this.isSuperAdmin()) return true;

    return permissions.every(p => this.hasPermission(p));
  }
  public isSuperAdmin(): boolean {
    const user = this.currentUserValue;
    if (user?.roles?.includes('Super Admin')) return true;
    return false;  
  }
}
