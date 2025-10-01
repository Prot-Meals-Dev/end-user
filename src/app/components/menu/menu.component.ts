import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from './service/menu.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../core/interceptor/auth.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, NgbDatepickerModule, ReactiveFormsModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  menu: any = []

  minDate: NgbDateStruct;
  today: NgbDateStruct;
  estimateForm: FormGroup;
  submitted = false;

  allRegions!: any[];
  selectedRegionId!: string;
  currentMealType!: any;
  totalAmount = 0;
  isLoggedIn = false;
  user: any = null;
  remarksLength = 0;

  constructor(
    private calendar: NgbCalendar,
    private fb: FormBuilder,
    private service: MenuService,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
    this.today = this.calendar.getToday();
    this.minDate = this.today;

    this.estimateForm = this.fb.group({
      breakfast: [false],
      lunch: [false],
      dinner: [false],
      remarks: ['', Validators.maxLength(125)],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      recurringDays: this.fb.group({
        Mon: [false],
        Tue: [false],
        Wed: [false],
        Thu: [false],
        Fri: [false],
        Sat: [false],
        Sun: [false],
      })
    }, { validators: [this.mealTypeValidator, this.recurringDaysValidator] });
  }

  ngOnInit(): void {
    this.loadRegions()
    this.loadMealTypes()

    this.estimateForm.valueChanges.subscribe(() => {
      this.calculateEstimateAmount();
    });
  }

  loadRegions() {
    this.service.getRegions().subscribe({
      next: (res: any) => {
        this.allRegions = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  loadMealTypes() {
    this.service.getMealTypes().subscribe({
      next: (res: any) => {
        this.currentMealType = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  fetchRegionMenu(id: string) {
    this.service.getRegionMenu(id).subscribe({
      next: (res: any) => {
        this.menu = res.data || [];
      },
      error: (err: any) => {
        console.error(err);
        this.menu = [];
      }
    });
  }

  mealTypeValidator(control: AbstractControl): ValidationErrors | null {
    const breakfast = control.get('breakfast')?.value;
    const lunch = control.get('lunch')?.value;
    const dinner = control.get('dinner')?.value;

    if (!breakfast && !lunch && !dinner) {
      return { noMealSelected: true };
    }
    return null;
  }

  recurringDaysValidator = (control: AbstractControl): ValidationErrors | null => {
    const days = control.get('recurringDays');
    if (!days) return null;

    const selectedDays = Object.values(days.value).filter(val => val).length;

    // Get start & end dates
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;

    if (!start || !end) {
      return selectedDays === 0 ? { noRecurringDay: true } : null;
    }

    const startDate = new Date(start.year, start.month - 1, start.day);
    const endDate = new Date(end.year, end.month - 1, end.day);

    const diffDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    if (selectedDays === 0) {
      return { noRecurringDay: true };
    }

    if (diffDays === 7 && selectedDays < 5) {
      return { minRecurringDaysRequired: true };
    }

    return null;
  };

  isDateDisabled = (date: NgbDate, current?: { year: number; month: number }): boolean => {
    const todayDate = new Date(this.today.year, this.today.month - 1, this.today.day);
    const checkDate = new Date(date.year, date.month - 1, date.day);
    return checkDate <= todayDate;
  };

  isEndDateDisabled = (date: NgbDate): boolean => {
    const start = this.estimateForm.get('startDate')?.value;
    if (!start) return true;

    const startDate = new Date(start.year, start.month - 1, start.day);
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 7);

    const currentDate = new Date(date.year, date.month - 1, date.day);

    return currentDate < minEndDate;
  };

  onSubmit() {
    this.submitted = true;

    if (this.estimateForm.invalid) {
      this.estimateForm.markAllAsTouched();
      return;
    }

    if (!this.authService.isLoggedIn()) {
      const buttonElement = document.activeElement as HTMLElement;
      buttonElement?.blur();

      const modalRef = this.modalService.open(LoginComponent, { centered: true, backdrop: 'static' });
      modalRef.result.then(
        () => {
          this.checkLoginStatus();

          if (this.isLoggedIn) {
            this.router.navigate(['/summary'], {
              state: {
                formData: this.estimateForm.value,
                totalAmount: this.totalAmount,
                user: this.user
              }
            });
          }
        },
        (reason) => {
          console.log('Login canceled:', reason);
        }
      );
    } else {
      this.checkLoginStatus();

      this.router.navigate(['/summary'], {
        state: {
          formData: this.estimateForm.value,
          totalAmount: this.totalAmount,
          user: this.user
        }
      });
    }
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.isLoggedIn ? this.authService.getUser() : null;
  }

  calculateEstimateAmount(): void {
    const form = this.estimateForm.value;

    if (!this.currentMealType || !form.startDate || !form.endDate) {
      this.totalAmount = 0;
      return;
    }

    const startDate = new Date(form.startDate.year, form.startDate.month - 1, form.startDate.day);
    const endDate = new Date(form.endDate.year, form.endDate.month - 1, form.endDate.day);

    if (endDate < startDate) {
      this.totalAmount = 0;
      return;
    }

    const recurringDaysMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    const selectedDayIndexes = Object.entries(form.recurringDays)
      .filter(([day, selected]) => selected)
      .map(([day]) => recurringDaysMap[day]);

    let totalDeliveryDays = 0;
    let current = new Date(startDate);

    while (current <= endDate) {
      if (selectedDayIndexes.includes(current.getDay())) {
        totalDeliveryDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    let total = 0;
    if (form.breakfast) {
      total += parseFloat(this.currentMealType[0].breakfast_price || '0') * totalDeliveryDays;
    }
    if (form.lunch) {
      total += parseFloat(this.currentMealType[0].lunch_price || '0') * totalDeliveryDays;
    }
    if (form.dinner) {
      total += parseFloat(this.currentMealType[0].dinner_price || '0') * totalDeliveryDays;
    }

    this.totalAmount = total;
  }

  updateRemarksCount() {
    const remarks = this.estimateForm.get('remarks')?.value || '';
    this.remarksLength = remarks.length;
  }

}
