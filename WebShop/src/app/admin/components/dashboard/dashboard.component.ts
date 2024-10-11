import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  products: any[] = [];
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
      res.forEach((element) => {
        element.processesImg = 'data:image/jpeg;base64' + element.byteImage;
        this.products.push(element);
      });
    });
  }

  submitForm() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;

    this.adminService.getAllProductsByName(title).subscribe((res) => {
      res.forEach((element) => {
        element.processesImg = 'data:image/jpeg;base64' + element.byteImage;
        this.products.push(element);
      });
    });
  }

  deleteProduct(productId: any) {
    this.adminService.deleteProduct(productId).subscribe({
      next: () => {
        this.snackBar.open('Categpry posted successfuly', 'Close', {
          duration: 50000,
        });
        this.getAllPoducts();
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }
}
