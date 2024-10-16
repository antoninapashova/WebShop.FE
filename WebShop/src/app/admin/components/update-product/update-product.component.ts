import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../service/admin/admin.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
})
export class UpdateProductComponent {
  productId = this.activatedroute.snapshot.params['productId'];

  productForm: FormGroup;
  listOfCategories: any[];
  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;
  existingImage: string | null = null;
  imgChanged = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private adminService: AdminService,
    private activatedroute: ActivatedRoute
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
    this.imgChanged = true;

    this.existingImage = null;
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
    this.getProductById();
  }

  getAllCategories() {
    this.adminService.getAllCategories().subscribe((res) => {
      this.listOfCategories = res;
    });
  }

  getProductById() {
    this.adminService.getProductById(this.productId).subscribe({
      next: (res) => {
        this.productForm.patchValue(res.data);
        //this.existingImage = 'data:image/jpeg;base64,' + res.data.byteImg;
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Error', {
          duration: 50000,
        });
      },
    });
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();
      if (this.imgChanged && this.selectedFile) {
        //formData.append('img', this.selectedFile);
      }
      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('name', this.productForm.get('name').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('price', this.productForm.get('price').value);
      formData.append('quantity', this.productForm.get('quantity').value);

      this.adminService
        .updateProductById(this.productForm.value, this.productId)
        .subscribe({
          next: (res) => {
            this.snackBar.open(res.message, 'Close', {
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
