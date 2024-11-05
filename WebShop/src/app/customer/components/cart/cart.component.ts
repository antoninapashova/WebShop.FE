import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import Cart from '../../interfaces/Cart';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import CartItem from '../../interfaces/CartItem';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cart: Cart;
  couponForm!: FormGroup;
  amountAfterDiscount: number;
  couponCode: any;
  discount: number;

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.couponForm = this.fb.group({
      code: [null, [Validators.required]],
    });

    this.getCart();
  }

  applyCoupon() {
    this.customerService
      .getDiscount(this.couponForm.get(['code'])!.value)
      .subscribe({
        next: (res) => {
          this.discount = res.data.discount;
          const totalPrice = this.cart.totalPrice;
          this.amountAfterDiscount =
            totalPrice - (totalPrice * this.discount) / 100.0;
          this.couponCode = res.data.code;
        },
        error: (err) => {
          this.snackBar.open(err.error.message, 'ERROR', {
            duration: 50000,
            panelClass: 'error-snackbar',
          });
        },
      });
  }

  getCart() {
    this.customerService.getCart().subscribe({
      next: (res) => {
        this.cart = res;
        this.cart.cartItems.forEach((element) => {
          element.image = {
            img: 'data:image/jpeg;base64,' + element.image.img,
          };
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

          this.optimisticQuantityUpdate(itemId, isIncreaseChange);
        },
        error: (err) => {
          this.snackBar.open(err.message, 'ERROR', {
            duration: 50000,
            panelClass: 'error-snackbar',
          });
        },
      });
  }

  deleteItem(id: string) {
    this.customerService.deleteItem(id).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', {
          duration: 50000,
        });

        this.optimisticItemsUpdate(id);
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'ERROR', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  placeOrder() {
    this.matDialog.open(PlaceOrderComponent, { data: this.couponCode });
  }

  optimisticItemsUpdate(itemId: string) {
    let items = this.cart.cartItems.filter((e) => e.id != itemId);
    this.optmisticUpdate(items);
  }

  optimisticQuantityUpdate(itemId: string, isIncreaseChange: boolean) {
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

    this.optmisticUpdate(items);
  }

  optmisticUpdate(items: CartItem[]) {
    let totalPrice = items.reduce(
      (accumulator, item) => (accumulator += item.price * item.quantity),
      0
    );

    this.cart = { ...this.cart, cartItems: items, totalPrice };
    this.amountAfterDiscount =
      totalPrice - (totalPrice * this.discount) / 100.0;
  }
}
