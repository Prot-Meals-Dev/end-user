import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummaryService } from './service/summary.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../shared/components/alert/service/alert.service';

@Component({
  selector: 'app-order-summary',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit {

  formData: any;
  totalAmount: number = 0;
  user: any;
  userDetails!: any;
  isLoading = true;

  mealTypes: string[] = [];
  selectedDays: string[] = [];
  formattedStartDate: string = '';
  formattedEndDate: string = '';

  editForm!: FormGroup;

  orderSuccess = false;
  showGoHomeBtn = false;

  constructor(
    private router: Router,
    private service: SummaryService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private alertService: AlertService
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
    this.extractMealTypes();
    this.extractRecurringDays();
    this.formatDates();

    this.getUserDetails()
  }

  getUserDetails() {
    this.service.getUser(this.user.id).subscribe({
      next: (res: any) => {
        this.userDetails = res.data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
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

  changeAddress(content: any) {
    this.initEditForm()
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement?.blur();

    this.modalService.open(content, { centered: true });
  }

  submitOrder() {
    if (!this.userDetails || !this.formData) return;

    const dayMap: { [key: string]: number } = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6
    };

    const payload = {
      contact_number: this.userDetails.phone,
      delivery_address: this.userDetails.address,

      meal_type_id: "2296546c-c788-47a7-94a5-35cfa041b2db",

      start_date: `${this.formData.startDate.year}-${String(this.formData.startDate.month).padStart(2, '0')}-${String(this.formData.startDate.day).padStart(2, '0')}`,
      end_date: `${this.formData.endDate.year}-${String(this.formData.endDate.month).padStart(2, '0')}-${String(this.formData.endDate.day).padStart(2, '0')}`,

      recurring_days: Object.entries(this.formData.recurringDays || {})
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => dayMap[day]),

      meal_preferences: {
        breakfast: !!this.formData.breakfast,
        lunch: !!this.formData.lunch,
        dinner: !!this.formData.dinner
      }
    };

    this.service.newOrder(payload).subscribe({
      next: (res: any) => {        
        if (res?.success) {
          this.openRazorpay(res.data);
        } else {
          this.router.navigate(['/failed']);
        }
      },
      error: () => {
        this.router.navigate(['/failed']);
      }
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  initEditForm() {
    this.editForm = this.fb.group({
      name: [this.userDetails?.name || '', Validators.required],
      phone: [
        this.userDetails?.phone || '',
        [
          Validators.required,
          Validators.pattern(/^(\+91[0-9]{10}|[0-9]{10})$/)
        ]
      ],
      address: [this.userDetails?.address || '', Validators.required]
    });
  }

  saveDeliveryDetails(modal: any) {
    if (this.editForm.valid) {
      const updatedDetails = this.editForm.value;
      this.userDetails = { ...this.userDetails, ...updatedDetails };
      this.modalService.dismissAll();
      this.alertService.showAlert({
        message: 'Details updated!',
        type: 'success',
        autoDismiss: true,
        duration: 4000
      });
    }
  }

  openRazorpay(data: any) {
    const options: any = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: data.name,
      description: data.description,
      order_id: data.razorpay_order_id,
      prefill: data.prefill,
      notes: data.notes,
      handler: (response: any) => {
        this.service.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          transactionId: data.transactionId
        }).subscribe({
          next: () => this.router.navigate(['/success']),
          error: () => this.router.navigate(['/failed'])
        });
        // this.modalService.dismissAll()
      },
      modal: {
        ondismiss: () => {
          console.error('Payment popup closed');
          this.router.navigate(['/failed']);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

}
