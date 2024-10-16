import { Component, ViewChild } from '@angular/core';
import { AdminService } from '../../service/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Order from '../../interfaces/Order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  displayedColumns: string[] = [
    'trackingId',
    'clientName',
    'amount',
    'description',
    'address',
    'orderDate',
    'deliveryDate',
    'status',
    'isApproved',
    'action',
  ];

  orders: Order[];
  dataSource = new MatTableDataSource();
  _paginator: MatPaginator;

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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.adminService.getPlacedOrders().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.orders = res;
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  changeOrderStatus(orderId: string, status: string) {
    this.adminService.changeOrderStatus(orderId, status).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', {
          duration: 50000,
        });

        this.optimisticUpdate(orderId, status);
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  optimisticUpdate(orderId: string, status: string) {
    let items = this.orders.map((element) => {
      return element.id === orderId ? { ...element, status: status } : element;
    });

    this.dataSource.data = items;
    this.orders = items;
  }
}