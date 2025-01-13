import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import Category from '../../../admin/interfaces/Category';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  products: any[] = [];
  searchProductForm!: FormGroup;
  rating: number = 0;
  averageRating: number = 0;
  filteredOptions: Observable<Category[]>;
  myControl = new FormControl<string | Category>('');
  categories: Category[];

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.getAllCategories();
  }

  ngOnInit() {
    this.getAllPoducts();
    this.searchProductForm = this.formBuilder.group({
      title: [null, [Validators.required]],
    });

    setTimeout(() => {
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.categories.slice();
        })
      );
    }, 1000);
  }

  getAllPoducts() {
    this.products = [];
    this.customerService.getAllProducts().subscribe((res) => {
      res.forEach((product) => {
        let mappedImages = product.images.map(
          (i) => 'data:image/jpeg;base64,' + i
        );

        product.images = mappedImages;
        this.products.push(product);
      });
    });
  }

  getAllCategories() {
    this.customerService
      .getAllCategories()
      .subscribe((res) => (this.categories = res));
  }

  submitForm() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;

    this.customerService.getAllProductsByName(title).subscribe((res) => {
      res.forEach((product) => {
        let mappedImages = product.images.map(
          (i) => 'data:image/jpeg;base64,' + i.img
        );

        product.images = mappedImages;
        this.products.push(product);
      });
    });
  }

  addToCart(id: any) {
    this.customerService.addToCart(id).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', {
          duration: 5000,
        });

        this.getAllPoducts();
      },
      error: (err) => {
        this.snackBar.open(err.message, 'ERROR', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  addRating(productId: string, rate: number) {
    this.customerService.addRating(productId, rate).subscribe({
      next: (res) => {
        this.rating = rate;
        this.snackBar.open(res.message, 'Close', {
          duration: 5000,
        });
      },
      error: (err) => {
        this.snackBar.open(err.message, 'ERROR', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  onCategorySelect(category: Category) {
    this.products = [];

    if (!category) {
      this.getAllPoducts();
      return;
    }

    this.customerService.getAllProducts().subscribe((res) => {
      const filteredProducts = res.filter(
        (product) => product.categoryName == category.name
      );

      if (filteredProducts.length > 0) {
        filteredProducts.forEach((product) => {
          let mappedImages = product.images.map(
            (i) => 'data:image/jpeg;base64,' + i
          );
          product.images = mappedImages;
          this.products.push(product);
        });
      } else {
        this.snackBar.open('No products found for this category.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  displayFn(category: Category): string {
    return category && category.name ? category.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name;

    let result = this.products.filter((product) =>
      product.categoryName.includes(filterValue)
    );

    return result;
  }
}
