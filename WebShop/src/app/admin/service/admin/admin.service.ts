import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../../services/storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  addCategory(name: string): Observable<any> {
    return this.http.post(
      BASIC_URL + `add-category/${name}`,
      {},
      { headers: this.createAuthorizationHeader() }
    );
  }

  getAllCategories(): Observable<any> {
    return this.http.get(BASIC_URL + 'all-categories', {
      headers: this.createAuthorizationHeader(),
    });
  }

  addProduct(productDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'add-product', productDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'all-products', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllProductsByName(name: any): Observable<any> {
    return this.http.get(BASIC_URL + `search/${name}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteProduct(id: any): Observable<any> {
    return this.http.delete(BASIC_URL + `delete-product/${id}`, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text',
    });
  }

  getPlacedOrders(): Observable<any> {
    return this.http.get(BASIC_URL + 'all-orders', {
      headers: this.createAuthorizationHeader(),
    });
  }

  changeOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(
      BASIC_URL + `set-order-status/${orderId}/${status}`,
      {},
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getOrderItems(orderId: string): Observable<any> {
    return this.http.get(BASIC_URL + `get-order-items/${orderId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().append(
      'Authorization',
      'Bearer ' + UserStorageService.getToken()
    );
  }
}
