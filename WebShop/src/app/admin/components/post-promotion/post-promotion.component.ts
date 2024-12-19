import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin/admin.service';
import { Router } from '@angular/router';
import Product from '../../interfaces/Product';

@Component({
  selector: 'app-post-promotion',
  templateUrl: './post-promotion.component.html',
  styleUrl: './post-promotion.component.scss',
})
export class PostPromotionComponent {
  promotionForm!: FormGroup;
  listOfProducts: Product[];
  selectedProducts: any[] = [];
  selectedItemsControl = new FormControl([]);

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.promotionForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      productId: [null, [Validators.required]],
      discount: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });

    this.getAllProducts();
  }

  toggleSelection(item: any): void {
    const index = this.selectedProducts.indexOf(item);
    let discountValue = Number(this.promotionForm.get('discount').value);

    if (index === -1) {
      let productImages = item.images.map(
        (element) => 'data:image/jpeg;base64,' + element.img
      );

      item.images = productImages;
      item.priceAfterDiscount =
        discountValue !== null
          ? item.price - (item.price * discountValue) / 100
          : item.price;
      this.selectedProducts.push(item);
    } else {
      this.selectedProducts.splice(index, 1);
    }
  }

  isSelected(item: any): boolean {
    return this.selectedProducts.includes(item);
  }

  createPromotion() {
    if (this.promotionForm.valid) {
      const formData: FormData = new FormData();

      formData.append('startDate', this.promotionForm.get('startDate').value);
      formData.append('endDate', this.promotionForm.get('endDate').value);
      formData.append('discount', this.promotionForm.get('discount').value);
      formData.append('name', this.promotionForm.get('name').value);

      this.selectedProducts.forEach((e) =>
        formData.append('productsInPromotion', e.id)
      );

      this.adminService.addPromotion(formData).subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 5000,
          });
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Error', {
            duration: 5000,
          });
        },
      });
    } else {
      this.promotionForm.markAllAsTouched();
    }
  }

  getAllProducts() {
    this.adminService.getAllNonPromotionalProducts().subscribe((res) => {
      this.listOfProducts = res;
    });
  }
}
