import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostCategoryComponent } from './components/post-category/post-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebShopMaterialModule } from '../WebShopMaterialModule';
import { provideHttpClient } from '@angular/common/http';
import { PostProductComponent } from './components/post-product/post-product.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderItemsComponent } from './components/order-items/order-items.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { SharedModule } from '../shared/shared.module';
import { PostCouponComponent } from './components/post-coupon/post-coupon.component';
import { CouponsComponent } from './components/coupons/coupons.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { OrderByStatusComponent } from './components/order-by-status/order-by-status.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { PostPromotionComponent } from './components/post-promotion/post-promotion.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    PostCategoryComponent,
    PostProductComponent,
    OrdersComponent,
    OrderItemsComponent,
    UpdateProductComponent,
    PostCouponComponent,
    CouponsComponent,
    AnalyticsComponent,
    OrderByStatusComponent,
    CategoriesComponent,
    PostPromotionComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    WebShopMaterialModule,
    SharedModule,
  ],
  providers: [provideHttpClient()],
})
export class AdminModule {}
