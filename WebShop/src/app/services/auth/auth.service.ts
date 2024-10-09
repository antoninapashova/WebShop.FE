import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService
  ) {}

  register(signupRequest: any): Observable<any> {
    return this.http.post(BASIC_URL + 'sign-up', signupRequest);
  }

  login(userCredentials: any) {
    return this.http.post(BASIC_URL + 'authenticate', userCredentials).pipe(
      map((res: any) => {
        const token = res.token;

        if (token) {
          this.userStorageService.saveToken(token);
          return true;
        }

        return false;
      })
    );
  }
}
