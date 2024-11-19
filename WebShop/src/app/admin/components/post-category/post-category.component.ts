import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../service/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-category',
  templateUrl: './post-category.component.html',
  styleUrl: './post-category.component.scss',
})
export class PostCategoryComponent {
  categoryForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  addCategory(): void {
    if (this.categoryForm.valid) {
      this.adminService.addCategory(this.categoryForm.value.name).subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 5000,
          });

          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar',
          });
        },
      });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
