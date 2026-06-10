import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { InactivityService } from '../../modules/auth/services/inactivity.service';
import { map, Observable, take } from 'rxjs';
import { StoragKeys } from '../constants/storage.constants';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(
    private authService: AuthService,
    private inactivity:InactivityService) 
    {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot) : Observable<boolean> 
    {
    
    const token=  localStorage.getItem(StoragKeys.TOKEN);
 
    return this.authService.currentUser$.pipe(
      
      take(1),
      map(user => {
        if (user && token  ) return true;
        this.authService.logout();
         return false;
      })
    );    
   
  }
   }

 
