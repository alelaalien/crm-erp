import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';  
import { URL_SERVICE } from 'src/app/config/config';
import { AuthResponseDto } from 'src/app/dtos/auth-response.dto';
import { map } from 'rxjs';
import { UserDTO } from 'src/app/dtos/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {

   constructor(private http: HttpClient) {}

     login(email: string, password: string): Observable<AuthResponseDto> {
       return this.http.post<AuthResponseDto>(`${URL_SERVICE}auth/login`, {
         email,
         password,
       });
     }

     forgotPassword(email: string) :Observable<boolean>
     {
      return this.http.post<{status: string}> (`${URL_SERVICE}/forgot-password`, email)
                      .pipe(map(response => response.status === 'success'));
     }

     getUserByToken() : Observable<UserDTO>
     {
      return this.http.get<UserDTO>(`${URL_SERVICE}auth/me`);
     }
}
