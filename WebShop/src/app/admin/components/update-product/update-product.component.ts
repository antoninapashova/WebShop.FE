import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../service/admin/admin.service';

interface UploadedFile {
  id: string;
  index: number;
  file: File;
}

interface ImagePreview {
  index: number;
  element: string;
}

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
})
export class UpdateProductComponent {
  productId = this.activatedroute.snapshot.params['productId'];

  productForm: FormGroup;
  listOfCategories: any[];

  selectedFiles: UploadedFile[] = [];
  imagePreviews: ImagePreview[] = [];
  existingImages: ImagePreview[] = [];

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
          this.imagePreviews.push({ index: i, element: e.target.result });
          this.existingImages.push({ index: i, element: e.target.result });
        };

        this.selectedFiles.push({ id: null, index: i, file: selectedFiles[i] });
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
      images: [null, [Validators.required]],
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
        this.productForm.patchValue(res);
        res.images.forEach((i, index) => {
          let image = 'data:image/jpeg;base64,' + i.img;
          const file = new File([new Blob([image])], '', {});

          this.selectedFiles.push({ id: i.id, index: index, file: file });
          this.existingImages.push({ index: index, element: image });
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
    const formData: FormData = new FormData();

    if (this.selectedFiles) {
      this.selectedFiles.forEach((selectedFile) => {
        if (selectedFile.id == null) {
          formData.append('images', selectedFile.file);
        } else {
        }
      });
    }

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
        console.log(err);

        this.snackBar.open(err, 'Error', {
          duration: 50000,
        });
      },
    });
  }

  onRemove(event) {
    this.imagePreviews.splice(this.imagePreviews.indexOf(event), 1);

    let removedImage = this.existingImages.splice(
      this.existingImages.indexOf(event),
      1
    );

    let image = this.selectedFiles.find(
      (e) => e.index == removedImage[0].index
    );

    this.adminService
      .deleteImage(this.productId, image.id)
      .subscribe((res) => console.log(res));
  }
}
