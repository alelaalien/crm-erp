 
import {Injectable, Injector } from  '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs'; 
import { AuthService } from 'src/app/modules/auth';
import { AuthStorageService } from '../../services/auth-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
   
    private storageService: AuthStorageService,
    private injector: Injector
  ) {  }
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
  
    const token = this.storageService.getToken();
  
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(authReq);
    }

    return next.handle(req).pipe(
        catchError((error : HttpErrorResponse) => {

          switch(error.status) {
            case 401: this.injector.get(AuthService).logout();  ;
            break;

            case 403: console.warn("Access denied: You do not have sufficient permissions.");
            break;
            case 500: console.error("Internal server error. Please try again later.");
            break;
            default: console.error("An unexpected error occurred:", error.message);
            break;
          }
           

          return throwError(()=> error);
        })
    );
  }
}

