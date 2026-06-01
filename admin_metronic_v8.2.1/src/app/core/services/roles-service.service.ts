import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { URL_SERVICE } from 'src/app/config/config';


@Injectable({
  providedIn: 'root'
})
export class RolesServiceService {

    isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;


    constructor(
      private http:HttpClient,
      public authservice: AuthService
    ){
      this.isLoadingSubject = new BehaviorSubject<boolean>(false);
      this.isLoading$ = this.isLoadingSubject.asObservable();

    }

    registerRole(data:any){

      this.isLoadingSubject.next(true);

      let URL = URL_SERVICE + "roles";

      let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token, 'Accept': 'application/json'});
     
      return this.http.post(URL, data, {headers: headers})
                      .pipe(finalize(()=>this.isLoadingSubject.next(false)));
    }
    listRoles(page=1, search:string=''){
        
      this.isLoadingSubject.next(true);

      let URL = URL_SERVICE + "roles?page=" + page + '&search=' + search;

      let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token, 'Accept': 'application/json'});
      
      return this.http.get(URL,{headers: headers})
                      .pipe(finalize(()=>this.isLoadingSubject.next(false)));
    }

    updateRole(  data:any){
 
      let role_id = data.id;

      this.isLoadingSubject.next(true);

      let URL = URL_SERVICE + "roles/" + role_id;

      let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token, 'Accept': 'application/json'});
     
      return this.http.put(URL, data, {headers: headers})
                      .pipe(finalize(()=>this.isLoadingSubject.next(false)));
    }

    deleteRole(data: any){
      
      let role_id = data.id;
      let URL = URL_SERVICE + "roles/" + role_id;
      let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token, 'Accept': 'application/json'});

      this.isLoadingSubject.next(true);
      return this.http.delete(URL, {headers: headers})
                      .pipe(finalize(()=> this.isLoadingSubject.next(false)));
    }
}
