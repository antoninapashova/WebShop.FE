import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrl: './post-product.component.scss',
})
export class PostProductComponent {
  productForm: FormGroup;
  listOfCategories: any[];
  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private adminService: AdminService
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(this.selectedFile);
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
    this.adminService.getAllCategories().subscribe((res) => {
      this.listOfCategories = res;
    });
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();
      //formData.append('img', this.selectedFile);
      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('name', this.productForm.get('name').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('price', this.productForm.get('price').value);
      formData.append('quantity', this.productForm.get('quantity').value);

      this.adminService.addProduct(this.productForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('Product posted successfuly!', 'Close', {
            duration: 50000,
          });
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (err) => {
          this.snackBar.open(err.error, 'Error', {
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
}
