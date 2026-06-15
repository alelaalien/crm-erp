import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { URL_SERVICE } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  isLoading$ : Observable<boolean>;
  isLoadingSubject : BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
   }

  listBranches(){
             
      this.isLoadingSubject.next(true);

      return this.http.get(URL_SERVICE + "branches").pipe(finalize(()=>{this.isLoadingSubject.next(false)}));
    }

  create(data : any)
  {
      this.isLoadingSubject.next(true);
      return this.http.post ( URL_SERVICE + "branches", data)
            .pipe(finalize(()=> this.isLoadingSubject.next(false)));

  }
  delete(data: any)
  {
    let brach_id = data.id;
    let url = URL_SERVICE + "branches/" + brach_id; 
    this.isLoadingSubject.next(true);
    return this.http.delete(url).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }
  
}
