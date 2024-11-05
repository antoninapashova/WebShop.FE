import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
})
export class UserOrdersComponent {
  orders: any;

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getUserOrders();
  }

  getUserOrders() {
    this.customerService.getCustomerOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.orders.forEach((order) => {
          order.items.forEach(
            (item) => (item.img = 'data:image/jpeg;base64,' + item.img)
          );
        });
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'ERROR', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }
}
