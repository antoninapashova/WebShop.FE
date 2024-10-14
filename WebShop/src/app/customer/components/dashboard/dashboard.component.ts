import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
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
    private customerService: CustomerService,
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
    this.customerService.getAllProducts().subscribe((res) => {
      res.forEach((element) => {
        element.processesImg = 'data:image/jpeg;base64' + element.byteImage;
        this.products.push(element);
      });
    });
  }

  submitForm() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;

    this.customerService.getAllProductsByName(title).subscribe((res) => {
      res.forEach((element) => {
        element.processesImg = 'data:image/jpeg;base64' + element.byteImage;
        this.products.push(element);
      });
    });
  }

  addToCart(id: any) {
    this.customerService.addToCart(id).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', {
          duration: 50000,
        });

        this.getAllPoducts();
      },
      error: (err) => {
        this.snackBar.open(err.message, 'ERROR', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }
}
