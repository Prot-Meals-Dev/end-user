import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  imports: [],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit {

  formData: any;
  totalAmount: number = 0;

  constructor(
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      formData: any;
      totalAmount: number;
    };

    this.formData = state?.formData;
    this.totalAmount = state?.totalAmount;
  }

  ngOnInit(): void {
    console.log(this.formData, this.totalAmount);
  }

}
