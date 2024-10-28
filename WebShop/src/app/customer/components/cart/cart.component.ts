import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import Cart from '../../interfaces/Cart';
import { PlaceOrderComponent } from '../place-order/place-order.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cart: Cart;

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.getCart();
  }

  getCart() {
    this.customerService.getCart().subscribe({
      next: (res) => {
        this.cart = res;
        res.cartItems.forEach((element) => {
          element.image = {
            img: 'data:image/jpeg;base64,' + element.image.img,
          };

          this.cart.cartItems.push(element);
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

  changeItemQuantity(itemId: string, isIncreaseChange: boolean) {
    this.customerService
      .changeItemQuantity(itemId, isIncreaseChange)
      .subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 50000,
          });

          this.optimisticUpdate(itemId, isIncreaseChange);
        },
        error: (err) => {
          this.snackBar.open(err.message, 'ERROR', {
            duration: 50000,
            panelClass: 'error-snackbar',
          });
        },
      });
  }

  placeOrder() {
    this.matDialog.open(PlaceOrderComponent);
  }

  optimisticUpdate(itemId: string, isIncreaseChange: boolean) {
    let items = this.cart.cartItems.map((element) => {
      if (isIncreaseChange) {
        return element.id == itemId
          ? { ...element, quantity: element.quantity + 1 }
          : element;
      } else {
        return element.id == itemId
          ? { ...element, quantity: element.quantity - 1 }
          : element;
      }
    });

    let totalPrice = items.reduce(
      (accumulator, item) => (accumulator += item.price * item.quantity),
      0
    );
    this.cart = { ...this.cart, cartItems: items, totalPrice };
  }
}
