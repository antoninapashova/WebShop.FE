import { HttpClient } from '@angular/common/http';
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
        const role = res.role;

        if (token) {
          this.userStorageService.saveToken(token);
          this.userStorageService.saveRole(role);
          return true;
        }

        return false;
      })
    );
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(BASIC_URL + `get-order/${orderId}`);
  }
}
