import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../customer/services/customer.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent {
  emailForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: [null, [Validators.required]],
    });
  }

  subscribe() {
    this.customerService
      .subscribe(this.emailForm.get('email').value)
      .subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', { duration: 5000 });
        },
        error: (err) => {
          this.snackBar.open(err.error.message, 'ERROR', {
            duration: 5000,
            panelClass: 'error-snackbar',
          });
        },
      });
  }
}
