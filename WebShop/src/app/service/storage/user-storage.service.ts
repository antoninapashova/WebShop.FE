import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN = 'ecom-token';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  private static userPayload: any;

  constructor() {
    UserStorageService.userPayload = this.decodeToken();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  getToken() {
    return localStorage.getItem(TOKEN);
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  static getRoleFromToken() {
    if (this.userPayload) {
      return this.userPayload.role;
    }
  }

  static isAdminLoggedIn(): boolean {
    if (this.userPayload) {
      return false;
    }

    const role: string = this.getRoleFromToken();
    return role == 'admin';
  }

  static isCustomerLoggedIn(): boolean {
    if (this.userPayload) {
      return false;
    }

    const role: string = this.getRoleFromToken();
    return role == 'customer';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
  }
}
