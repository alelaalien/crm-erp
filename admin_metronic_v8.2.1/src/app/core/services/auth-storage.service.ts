import { Injectable } from '@angular/core';
import { UserDTO } from 'src/app/dtos/user.dto';
import { StoragKeys } from '../constants/storage.constants';
 

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
 
  private readonly TOKEN_KEY = StoragKeys.TOKEN;
  private readonly USER_KEY = StoragKeys.USER;
  
  constructor() { }

  saveAuth(token: string, user: UserDTO): void
  {
   
     localStorage.setItem(this.TOKEN_KEY, token);
     localStorage.setItem(this.USER_KEY, JSON.stringify(user));
 
  }

  getToken(): string | null
  {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser() : UserDTO | null
  {
    const user = localStorage.getItem(this.USER_KEY);
    try {
          return user? JSON.parse(user) : null;
    } catch (error) {
      console.log("Error parsing user from localstorage", error);
      return null;
    }
  }

  clear(): void
  { 
    localStorage.removeItem(this.TOKEN_KEY); 
    localStorage.removeItem(this.USER_KEY);
  }
}
