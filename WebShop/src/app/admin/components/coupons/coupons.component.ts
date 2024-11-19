import { Component } from '@angular/core';
import { AdminService } from '../../service/admin/admin.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss',
})
export class CouponsComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'discount',
    'code',
    'expirationDate',
  ];

  dataSource: any;
  cindex: number;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getCoupons();
  }

  getCoupons() {
    this.adminService
      .getAllCoupons()
      .subscribe((res) => (this.dataSource = res));
  }

  clickEvent(index) {
    this.cindex = index;
  }
}
