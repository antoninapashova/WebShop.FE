import { Component, ViewChild } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
