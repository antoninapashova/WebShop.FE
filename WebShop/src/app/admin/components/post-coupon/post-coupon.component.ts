import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin/admin.service';

@Component({
  selector: 'app-post-coupon',
  templateUrl: './post-coupon.component.html',
  styleUrl: './post-coupon.component.scss',
})
export class PostCouponComponent {
  couponForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.couponForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      discount: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    });
  }

  addCoupon() {
    if (this.couponForm.valid) {
      this.adminService.addCoupon(this.couponForm.value).subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 5000,
          });
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (err) => {
          this.snackBar.open(err.error.message, 'Error', {
            duration: 5000,
          });
        },
      });
    } else {
      this.couponForm.markAllAsTouched();
    }
  }
}
