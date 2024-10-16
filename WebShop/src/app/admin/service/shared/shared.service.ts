import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  orderId: string;

  constructor() {}

  setData(data: string) {
    this.orderId = data;
  }
  getData(): string {
    return this.orderId;
  }
}
