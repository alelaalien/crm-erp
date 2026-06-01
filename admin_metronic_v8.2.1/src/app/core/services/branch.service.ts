import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { URL_SERVICE } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  isLoading$ : Observable<boolean>;
  isLoadingSubject : BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    private authservice : AuthService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
   }

  listBranches(){
             
           this.isLoadingSubject.next(true);
     
           let URL = URL_SERVICE + "branches";
     
           let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token, 'Accept': 'application/json'});
           
           return this.http.get(URL,{headers: headers})
                           .pipe(finalize(()=>{this.isLoadingSubject.next(false)}));
         }
}
