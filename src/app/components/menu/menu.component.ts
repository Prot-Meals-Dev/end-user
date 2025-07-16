import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
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
}
