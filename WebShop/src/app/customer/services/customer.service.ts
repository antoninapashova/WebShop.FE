import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

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

  addToCart(productId: any): Observable<any> {
    return this.http.post(
      BASIC_URL + `add-to-cart/${productId}`,
      {},
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getCart(): Observable<any> {
    return this.http.get(BASIC_URL + 'get-cart', {
      headers: this.createAuthorizationHeader(),
    });
  }

  changeItemQuantity(
    cartItemId: string,
    isIncreaseChange: boolean
  ): Observable<any> {
    return this.http.put(
      BASIC_URL + 'cart/changeItemQuantity',
      { cartItemId, isIncreaseChange },
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  placeOrder(orderDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'create-order', orderDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getDiscount(code: string): Observable<any> {
    return this.http.get(BASIC_URL + `coupon/${code}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(BASIC_URL + `delete/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getCustomerOrders() {
    return this.http.get(BASIC_URL + 'user/orders', {
      headers: this.createAuthorizationHeader(),
    });
  }

  subscribeToNewsletter(email: string): Observable<any> {
    return this.http.post(BASIC_URL + `subscribe/${email}`, {});
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().append(
      'Authorization',
      'Bearer ' + UserStorageService.getToken()
    );
  }
}
