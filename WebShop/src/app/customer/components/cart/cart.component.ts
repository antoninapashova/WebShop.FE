import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import Cart from '../../interfaces/Cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cart: Cart;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.getCart();
  }

  getCart() {
    this.customerService.getCart().subscribe({
      next: (res) => {
        // res.cartItems.forEach((element) => {
        //   element.processesImg =
        //     'data:image/jpeg;base64,' + element.returnedImg;
        //  });

        this.cart = res;
      },
      error: (err) => {
        this.snackBar.open(err.message, 'ERROR', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  changeItemQuantity(itemId: string, isIncreaseChange: boolean) {
    this.customerService
      .changeItemQuantity(itemId, isIncreaseChange)
      .subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 50000,
          });
        },
        error: (err) => {
          this.snackBar.open(err.message, 'ERROR', {
            duration: 50000,
            panelClass: 'error-snackbar',
          });
        },
      });
  }
}
