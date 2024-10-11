import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  products: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getAllPoducts();
  }

  getAllPoducts() {
    this.products = [];
    this.adminService.getAllProducts().subscribe((res) => {
      res.forEach((element) => {
        element.processesImg = 'data:image/jpeg;base64' + element.byteImage;
        this.products.push(element);
      });
    });
  }
}
