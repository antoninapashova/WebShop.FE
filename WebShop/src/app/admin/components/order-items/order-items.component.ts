import { Component, ViewChild } from '@angular/core';
import OrderItem from '../../interfaces/OrderItem';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminService } from '../../service/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../service/shared/shared.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.scss',
})
export class OrderItemsComponent {
  displayedColumns: string[] = ['name', 'price', 'quantity'];

  cindex: number;
  orderItems: OrderItem[];
  dataSource = new MatTableDataSource();
  _paginator: MatPaginator;
  orderId: string;

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this._paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.getOrderItems();
  }

  clickEvent(index) {
    this.cindex = index;
  }

  getOrderItems() {
    this.orderId = this.sharedService.getData();

    this.adminService.getOrderItems(this.orderId).subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.orderItems = res;
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
