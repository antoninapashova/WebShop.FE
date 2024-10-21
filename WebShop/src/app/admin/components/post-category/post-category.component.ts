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
      this.adminService
        .addCategory(this.categoryForm.value.name)
        .subscribe((res) => {
          if (res.id != null) {
            this.snackBar.open('Categоry posted successfuly', 'Close', {
              duration: 50000,
            });

            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.snackBar.open(res.message, 'Close', {
              duration: 50000,
              panelClass: 'error-snackbar',
            });
          }
        });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
