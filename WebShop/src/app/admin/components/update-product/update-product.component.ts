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
  imagePreviews: string[] = [];
  imagesToSend: BinaryType[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private adminService: AdminService,
    private activatedroute: ActivatedRoute
  ) {}

  onFileSelected(event: any) {
    let selectedFiles: File[] = event.target.files;

    if (selectedFiles && selectedFiles[0]) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const base64String = e.target.result.split(',')[1];
          this.imagePreviews.push(e.target.result);
          this.imagesToSend.push(base64String);
        };

        reader.readAsDataURL(selectedFiles[i]);
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
    this.getProductById();
  }

  getAllCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (res) => (this.listOfCategories = res),
      error: (err) => {
        this.snackBar.open(err.message, 'Error', {
          duration: 50000,
        });
      },
    });
  }

  getProductById() {
    this.adminService.getProductById(this.productId).subscribe({
      next: (res) => {
        this.productForm.patchValue(res);
        res.images.forEach((i) => {
          let image = i.img.startsWith('data:image/')
            ? i.img
            : 'data:image/jpeg;base64,' + i.img;
          this.imagePreviews.push(image);
          this.imagesToSend.push(i.img);
        });
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

      this.imagesToSend.forEach((base64Image) => {
        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        formData.append('images', blob);
      });

      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('name', this.productForm.get('name').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('price', this.productForm.get('price').value);
      formData.append('quantity', this.productForm.get('quantity').value);

      this.adminService.updateProductById(formData, this.productId).subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 50000,
          });
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (err) => {
          this.snackBar.open(err, 'Error', {
            duration: 50000,
          });
        },
      });
    } else {
      for (let i in this.productForm.controls) {
        this.productForm.controls[i].updateValueAndValidity();
      }
    }
  }

  onRemove(event) {
    this.imagePreviews.splice(this.imagePreviews.indexOf(event), 1);
    this.imagesToSend.splice(this.imagesToSend.indexOf(event), 1);
  }
}
