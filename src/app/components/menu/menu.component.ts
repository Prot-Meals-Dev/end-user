import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from './service/menu.service';

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

  constructor(
    private calendar: NgbCalendar,
    private fb: FormBuilder,
    private service: MenuService,
  ) {
    this.today = this.calendar.getToday();
    this.minDate = this.today;

    this.estimateForm = this.fb.group({
      breakfast: [false],
      lunch: [false],
      dinner: [false],
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
    this.service.getMenu().subscribe({
      next: (res: any) => {
        console.log(res);
      }
    })

    this.loadRegions()
  }

  loadRegions() {
    this.service.getRegions().subscribe({
      next: (res: any) => {
        this.allRegions = res.data;
        console.log(res);

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

  recurringDaysValidator(control: AbstractControl): ValidationErrors | null {
    const days = control.get('recurringDays');
    if (!days) return null;

    const anySelected = Object.values(days.value).some(val => val);
    if (!anySelected) {
      return { noRecurringDay: true };
    }
    return null;
  }

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
    console.log(this.estimateForm.value);
  }
}
