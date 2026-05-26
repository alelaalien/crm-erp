import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { URL_SERVICE } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isLoadingUser$ : Observable<boolean>;
  isLoadingSubject : BehaviorSubject<boolean>;

  constructor(
        private http: HttpClient,
        private authservice: AuthService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoadingUser$= this.isLoadingSubject.asObservable();
   }

   registerUser(data:any){
   
         this.isLoadingSubject.next(true);
   
         let URL = URL_SERVICE + "users";
   
         let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token, 'Accept': 'application/json'});
        
         return this.http.post(URL, data, {headers: headers})
                         .pipe(finalize(()=>this.isLoadingSubject.next(false)));
       }
       listUsers(page=1, search:string=''){
           
         this.isLoadingSubject.next(true);
   
         let URL = URL_SERVICE + "users?page=" + page + '&search=' + search;
   
         let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token, 'Accept': 'application/json'});
         
         return this.http.get(URL,{headers: headers})
                         .pipe(finalize(()=>this.isLoadingSubject.next(false)));
       }
   
       updateUser(data:any){
    
         const user_id = data.get("id");
      
         console.log("usuario a actualizar " +user_id);
        
         this.isLoadingSubject.next(true);
   
         let URL = URL_SERVICE + "users/" + user_id;
   
         let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token, 'Accept': 'application/json'});
        
         return this.http.post(URL, data, {headers: headers})
                         .pipe(finalize(()=>this.isLoadingSubject.next(false)));
       }
   
       deleteUser(data: any){
         
         let user_id = data.id;
         let URL = URL_SERVICE + "users/" + user_id;
         let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token, 'Accept': 'application/json'});
   
         this.isLoadingSubject.next(true);
         return this.http.delete(URL, {headers: headers})
                         .pipe(finalize(()=> this.isLoadingSubject.next(false)));
       }
}
