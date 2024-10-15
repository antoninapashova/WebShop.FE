import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.scss',
})
export class PlaceOrderComponent {
  orderForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      address: [null, [Validators.required]],
      description: [null],
    });
  }

  placeOrder() {
    this.customerService.placeOrder(this.orderForm.value).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', {
          duration: 50000,
        });

        // this.router.navigateByUrl('/customer/my-orders');
      },
      error: (err) => {
        this.snackBar.open(err.message, 'ERROR', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  closeForm() {
    this.dialog.closeAll();
  }
}
