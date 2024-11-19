import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth/auth.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  signinForm!: FormGroup;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.minLength(5)]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      let username = this.signinForm.value.username;
      let password = this.signinForm.value.password;

      this.authService.login({ username, password }).subscribe({
        next: () => {
          let role: String;
          if (UserStorageService.isAdminLoggedIn()) {
            role = 'ADMIN';
          } else if (UserStorageService.isCustomerLoggedIn()) {
            role = 'CUSTOMER';
          }

          this.router.navigateByUrl(`${role.toLowerCase()}/dashboard`);
        },
        error: () => {
          this.snackBar.open('Bad credentials', 'ERROR', { duration: 5000 });
        },
      });
    }
  }
}
