import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss',
})
export class TrackOrderComponent {
  searchOrderForm!: FormGroup;
  order: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.searchOrderForm = this.fb.group({
      id: [null, [Validators.required]],
    });
  }

  submitForm() {
    this.authService
      .getOrderById(this.searchOrderForm.get('id').value)
      .subscribe({
        next: (res) => (this.order = res),
        error: (err) => {
          this.snackBar.open(err.error.message, 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar',
          });
        },
      });
  }
}
