import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map,finalize, catchError } from 'rxjs/operators';
import { UserDTO } from 'src/app/dtos/user.dto';  
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http'; 
import { InactivityService } from '../../modules/auth/services/inactivity.service';
import { AuthStorageService } from '../services/auth-storage.service'; 
import { AuthHttpService } from '../services/auth-http.service'; 

export type UserType = UserDTO | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements  OnDestroy {
  // private fields
      private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
       
      private userSubject = new BehaviorSubject<UserType>(undefined);
      private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

      public currentUser$ =  this.userSubject.asObservable();
      public isLoading$ = this.isLoadingSubject.asObservable();
      public token: any;
      public user: any;
    
      constructor(

          private router: Router, 
          private storageService: AuthStorageService,
          private authHttp : AuthHttpService,
          // private inactivity: InactivityService
          ) 
          {
             const subscr = this.getUserByToken().subscribe();
              this.unsubscribe.push(subscr);
          }
     
      get currentUserValue(): UserType {
        return this.userSubject.value;
      }

      set currentUserValue(user: UserType) {
        this.userSubject.next(user);
      }


  // public methods
      login(email: string, password: string):Observable<any>  {
        
          this.isLoadingSubject.next(true);

          return this.authHttp.login(email, password)
                              .pipe( map((auth: any)=>
                                      {
                                        console.log(auth);
                                          this.storageService.saveAuth(auth.access_token, auth.user);
                                          this.userSubject.next(auth.user)
                                          return auth;
                                      }),  
                                  
                              finalize(() => this.isLoadingSubject.next(false))); 
                                  
      }

      logout() {
        
          this.storageService.clear();
          this.userSubject.next(undefined);
          this.router.navigate(['/auth/login'], {
            queryParams: {},
          });
      }
 
      getUserByToken(): Observable<UserDTO | undefined >{
        
          this.user = this.getUserFromLocalStorage();
          
          const auth = this.user;
          
          if (!auth){
           
            this.logout();
            
            return  of(undefined) ;
          }
          
          this.isLoadingSubject.next(true);
 
          return this.authHttp.getUserByToken()
                              .pipe(map((user: UserDTO)=>
                              {
                                  this.user = user;
                                  this.userSubject.next(user);
                                  this.isLoadingSubject.next(false);
                                  
                                  return user;
                              }),
                            
                                    catchError((err: HttpErrorResponse) =>
                                    {
                                      this.isLoadingSubject.next(false);
                                      console.log(err);
                                      this.logout();
                                      return of(undefined);
                                    }));

    
      }
  
      forgotPassword(email: string): Observable<boolean> {
          
        this.isLoadingSubject.next(true);
        

          return this.authHttp.forgotPassword( email ).pipe(
              finalize(() => this.isLoadingSubject.next(false))
          );
      }
  
      private getUserFromLocalStorage(): UserDTO | undefined {
        return this.storageService.getUser() || undefined;
      }
    
 /*  
  
  //console.group('🔍 Depuración de Auth');//
  console.log('Usuario actual en el Subject:', user);
  
}*/ 
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
        console.log(user);
        if (user?.roles?.includes('Super Admin')) console.log("es admin");// return true;
        return false;  
      }

      ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
      }  
}
