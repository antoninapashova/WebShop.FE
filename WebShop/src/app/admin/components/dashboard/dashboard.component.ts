import { Component } from '@angular/core';
import { AdminService } from '../../service/admin/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Product from '../../interfaces/Product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  products: Product[] = [];
  searchProductForm!: FormGroup;

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllPoducts();
    this.searchProductForm = this.formBuilder.group({
      title: [null, [Validators.required]],
    });
  }

  getAllPoducts() {
    this.products = [];
    this.adminService.getAllProducts().subscribe((res) => {
      res.forEach((product) => {
        let mappedImages = product.images.map(
          (i) => 'data:image/jpeg;base64,' + i.img
        );

        product.images = mappedImages;
        this.products.push(product);
      });
    });
  }

  submitForm() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;

    this.adminService.getAllProductsByName(title).subscribe((res) => {
      res.forEach((product) => {
        let mappedImages = product.images.map(
          (i) => 'data:image/jpeg;base64,' + i.img
        );

        product.images = mappedImages;
        this.products.push(product);
      });
    });
  }

  deleteProduct(productId: any) {
    this.adminService.deleteProduct(productId).subscribe({
      next: (res) => {
        this.snackBar.open(res, 'Close', {
          duration: 50000,
        });
        this.getAllPoducts();
      },
      error: (err) => {
        this.snackBar.open(err, 'Close', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }
}
