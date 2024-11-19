import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin/admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Category from '../../interfaces/Category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  displayedColumns: string[] = ['id', 'name', 'delete'];
  cindex: number;
  categories: Category[];
  dataSource = new MatTableDataSource();
  _paginator: MatPaginator;
  visible: boolean = false;

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this._paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  constructor(
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.getAllCategories();
  }

  clickEvent(index) {
    this.cindex = index;
  }

  getAllCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.dataSource.data = this.categories;
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Error', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  deleteCategory(id: string) {
    this.adminService.deleteCategory(id).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', {
          duration: 5000,
        });

        this.optimisticDelete(id);
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Error', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  optimisticDelete(id: string) {
    this.dataSource.data = this.categories.filter((c) => c.id != id);
  }
}
