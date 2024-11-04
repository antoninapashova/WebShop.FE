import { Component, ViewChild } from '@angular/core';
import { AdminService } from '../../service/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Order from '../../interfaces/Order';
import { SharedService } from '../../service/shared/shared.service';

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
    'changeStatus',
    'isApproved',
    'setApprove',
    'showOrderItems',
  ];

  cindex: number;
  orders: Order[];
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
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.getOrders();
  }

  clickEvent(index) {
    this.cindex = index;
  }

  showOrderItems(orderId: string) {
    this.visible = !this.visible;
    this.sharedService.setData(orderId);
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

        this.optimisticStatusUpdate(orderId, status);
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  setIsApproved(orderId: string, approved: string) {
    let isApproved: boolean = false;
    if (approved === 'Approved') {
      isApproved = true;
    }

    this.adminService.setApprovedStatus(orderId, isApproved).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', {
          duration: 50000,
        });
        this.optimisticApprovementUpdate(orderId, res.message);
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', {
          duration: 50000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  optimisticApprovementUpdate(orderId: string, approved: string) {
    let items = this.orders.map((element) => {
      return element.id === orderId
        ? { ...element, isApproved: approved }
        : element;
    });

    this.dataSource.data = items;
    this.orders = items;
  }

  optimisticStatusUpdate(orderId: string, status: string) {
    let items = this.orders.map((element) => {
      return element.id === orderId ? { ...element, status: status } : element;
    });

    this.dataSource.data = items;
    this.orders = items;
  }
}
