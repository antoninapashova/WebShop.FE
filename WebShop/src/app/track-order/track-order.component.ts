import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss',
})
export class TrackOrderComponent {
  searchOrderForm!: FormGroup;
  order: any;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.searchOrderForm = this.fb.group({
      id: [null, [Validators.required]],
    });
  }

  submitForm() {
    this.authService
      .getOrderById(this.searchOrderForm.get('id').value)
      .subscribe((res) => (this.order = res));
  }
}
