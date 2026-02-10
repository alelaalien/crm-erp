import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { InactivityService } from './inactivity.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private authService: AuthService,private inactivity:InactivityService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   
    if (!this.authService.user || !this.authService.token  ) {
       this.authService.logout();
      return false;
    }

     
    
    // not logged in so redirect to login page with the return url
    //this.authService.logout();
    return true;
  }
}
