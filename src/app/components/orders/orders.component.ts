import { Component, OnInit } from '@angular/core';
import { OrderService } from './service/order.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../shared/components/alert/service/alert.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, PaginationModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  filters = {
    limit: 10,
    page: 1
  };
  orderList!: any[]
  payableAmount: number = 0;
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  weekdayMap: { [key: number]: string } = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
  };

  constructor(
    private service: OrderService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadOrderList()
  }

  loadOrderList(bool?: boolean) {
    this.isLoading = true;
    this.filters.limit = this.itemsPerPage;
    this.filters.page = this.currentPage;

    if (bool) {
      this.filters.limit = 10;
      this.filters.page = 1;
    }

    this.service.getOrdersList(this.filters).subscribe({
      next: (res: any) => {        
        this.orderList = res.data.data || [];
        this.totalItems = res.data.pagination?.total || 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
        this.isLoading = false;
      }
    })
  }

  onPageChange(event: { page: number; itemsPerPage: number }) {
    if (this.currentPage !== event.page) {
      this.currentPage = event.page;
      this.itemsPerPage = event.itemsPerPage;
      this.loadOrderList();
    }
  }

  getWeekdays(preferences: any[]): string {
    if (!preferences || preferences.length === 0) return '';
    return preferences
      .map(p => this.weekdayMap[p.week_day])
      .join(', ');
  }

  getMeals(preferences: any[]): string {
    if (!preferences || preferences.length === 0) return '';
    const p = preferences[0];
    const meals: string[] = [];
    if (p.breakfast) meals.push('Breakfast');
    if (p.lunch) meals.push('Lunch');
    if (p.dinner) meals.push('Dinner');
    return meals.join(' | ');
  }
  
}
