import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, NgbDatepickerModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menu = [
    {
      id: 1,
      day: 'Monday',
      breakfast: 'Appam, Kuruma',
      lunch: 'Rice, Aviyal, Achar, Fish Curry, Fish Fry, Thoran, Pullisheri, Rasam',
      dinner: 'Chapati,Soya Chunks'
    },
    {
      id: 2,
      day: 'Tuesday',
      breakfast: 'Idli,Sambar',
      lunch: 'Rice, Thoran, Sambar, Rasam, Kichedi,Kootu Curry,Omlet',
      dinner: 'Porotta, Chicken Curry'
    },
    {
      id: 3,
      day: 'Wednesday',
      breakfast: 'Puttu, Pazham, Payar, Pappadam',
      lunch: 'Vegetable, Biriyani, Achar, Salad',
      dinner: 'Appam, Mutta Curry'
    },
    {
      id: 4,
      day: 'Thursday',
      breakfast: 'Dosa, Sambar',
      lunch: 'Rice, Aviyal, Achar, Fish Curry, Thoran, Sambar, Rasam',
      dinner: 'Chapathi, Mutta Curry'
    },
    {
      id: 5,
      day: 'Friday',
      breakfast: 'Uppumavu, Pazham, Kuruma',
      lunch: 'Egg fried rice, Achar, Salad',
      dinner: 'Dosa, Kadala Curry'
    },
    {
      id: 6,
      day: 'Saturday',
      breakfast: 'Idiyappam, Kuruma',
      lunch: 'Rice,achar, Mezhukkuperatti, Aviyal, Fish Fry, Pulisheri, Fish Curry',
      dinner: 'Chapati, Kuruma'
    },
    {
      id: 7,
      day: 'Sunday',
      breakfast: 'Dosa, Kadala curry',
      lunch: 'Biriyani, Achar, Salad',
      dinner: 'Puttu, Kadala Curry'
    },
  ]

  minDate: NgbDateStruct;
  today: NgbDateStruct;

  constructor(
    private calendar: NgbCalendar,
  ) {
    this.today = this.calendar.getToday();
    this.minDate = this.today;
  }

  isDateDisabled = (date: NgbDate, current?: { year: number; month: number }): boolean => {
    const todayDate = new Date(this.today.year, this.today.month - 1, this.today.day);
    const checkDate = new Date(date.year, date.month - 1, date.day);
    return checkDate <= todayDate;
  };
}
