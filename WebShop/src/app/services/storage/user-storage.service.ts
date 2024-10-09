import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN = 'ecom-token';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  static getToken(): any {
    return localStorage.getItem(TOKEN);
  }

  static decodeToken(): any {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  static getRoleFromToken() {
    if (this.getToken()) {
      let token = this.decodeToken();
      return token.sub;
    }
  }

  static isAdminLoggedIn(): boolean {
    if (this.getToken() == null) {
      return false;
    }

    const role: string = this.getRoleFromToken();
    return role == 'admin';
  }

  static isCustomerLoggedIn(): boolean {
    if (this.getToken() == null) {
      return false;
    }

    const role: string = this.getRoleFromToken();
    return role == 'customer';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
  }
}
