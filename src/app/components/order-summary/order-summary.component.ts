import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummaryService } from './service/summary.service';

@Component({
  selector: 'app-order-summary',
  imports: [],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit {

  formData: any;
  totalAmount: number = 0;
  user: any;
  userDetails!: any;

  mealTypes: string[] = [];
  selectedDays: string[] = [];
  formattedStartDate: string = '';
  formattedEndDate: string = '';

  constructor(
    private router: Router,
    private service: SummaryService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      formData: any;
      totalAmount: number;
      user: any;
    };

    this.formData = state?.formData;
    this.totalAmount = state?.totalAmount;
    this.user = state?.user;
  }

  ngOnInit(): void {
    console.log(this.formData, this.totalAmount, this.user);

    this.extractMealTypes();
    this.extractRecurringDays();
    this.formatDates();

    this.getUserDetails()
  }

  getUserDetails() {
    this.service.getUser(this.user.id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.userDetails = res.data;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  extractMealTypes() {
    const types = this.formData;
    this.mealTypes = [];
    if (types?.breakfast) this.mealTypes.push('Breakfast');
    if (types?.lunch) this.mealTypes.push('Lunch');
    if (types?.dinner) this.mealTypes.push('Dinner');
  }

  extractRecurringDays() {
    this.selectedDays = Object.entries(this.formData?.recurringDays || {})
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day);
  }

  formatDates() {
    const start = this.formData?.startDate;
    const end = this.formData?.endDate;
    if (start) this.formattedStartDate = `${start.day}/${start.month}/${start.year}`;
    if (end) this.formattedEndDate = `${end.day}/${end.month}/${end.year}`;
  }

  changeAddress() {
    console.log('Change Delivery Address clicked');
  }

  submitOrder() {
    console.log('Submit clicked');
    // Implement submit logic
  }

}
