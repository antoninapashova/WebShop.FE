import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { matchValidator } from '../password-match-validator';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      email: [
        null,
        [Validators.required, Validators.minLength(5), Validators.email],
      ],
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          matchValidator('confirmPassword', true),
        ],
      ],
      confirmPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          matchValidator('password'),
        ],
      ],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    console.log(this.signupForm);

    this.authService.register(this.signupForm.value).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 5000 });
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 5000,
          panelClass: 'eroro-snackbar',
        });
      },
    });
  }
}
