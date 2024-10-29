import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin/admin.service';

interface UploadedFile {
  index: number;
  file: File;
}

interface ImagePreviews {
  index: number;
  element: string;
}

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrl: './post-product.component.scss',
})
export class PostProductComponent {
  productForm: FormGroup;
  listOfCategories: any[];
  uploadedFiles: UploadedFile[] = [];
  imagePreviews: ImagePreviews[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private adminService: AdminService
  ) {}

  onFileSelected(event: any) {
    let selectedFiles: File[] = event.target.files;

    if (selectedFiles && selectedFiles[0]) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.imagePreviews.push({ index: i, element: e.target.result });
        };

        reader.readAsDataURL(selectedFiles[i]);
        this.uploadedFiles.push({ index: i, file: selectedFiles[i] });
      }
    }
  }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
    });

    this.getAllCategories();
  }

  getAllCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (res) => (this.listOfCategories = res.data),
      error: (err) => {
        this.snackBar.open(err.message, 'Error', {
          duration: 50000,
        });
      },
    });
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();

      this.uploadedFiles.forEach((e) => formData.append('images', e.file));
      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('name', this.productForm.get('name').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('price', this.productForm.get('price').value);
      formData.append('quantity', this.productForm.get('quantity').value);

      this.adminService.addProduct(formData).subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 50000,
          });
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (err) => {
          this.snackBar.open(err.error.message, 'Error', {
            duration: 50000,
          });
        },
      });
    } else {
      for (const i in this.productForm) {
        this.productForm.controls[i].updateValueAndValidity();
      }
    }
  }

  onRemove(event) {
    this.imagePreviews.splice(this.imagePreviews.indexOf(event), 1);
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }
}
