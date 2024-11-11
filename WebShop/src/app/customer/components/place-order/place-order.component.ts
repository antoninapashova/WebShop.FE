import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.scss',
})
export class PlaceOrderComponent {
  orderForm!: FormGroup;
  trackingId: string;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      address: [null, [Validators.required]],
      description: [null],
    });
  }

  placeOrder() {
    const formData: FormData = new FormData();
    if (this.data != null) {
      formData.append('couponCode', this.data.toString());
    }
    formData.append('address', this.orderForm.get('address').value);
    formData.append('description', this.orderForm.get('description').value);

    this.customerService.placeOrder(formData).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 5000 });
        this.router.navigateByUrl('/customer/dashboard');
        this.trackingId = res.data;
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'ERROR', {
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
