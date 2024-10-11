import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN = 'ecom-token';
const ROLE = 'ecom-role';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  public saveRole(role: string): void {
    window.localStorage.removeItem(ROLE);
    window.localStorage.setItem(ROLE, role);
  }

  static getToken(): any {
    return localStorage.getItem(TOKEN);
  }

  static getRole() {
    return localStorage.getItem(ROLE);
  }

  static decodeToken(): any {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  static getUsernameFromToken() {
    if (this.getToken()) {
      let token = this.decodeToken();
      return token.sub;
    }
  }

  static isAdminLoggedIn(): boolean {
    const role: string = this.getRole();

    if (role == null) {
      return false;
    }

    return role == 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    const role: string = this.getRole();

    if (role == null) {
      return false;
    }

    return role == 'CUSTOMER';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(ROLE);
  }
}
