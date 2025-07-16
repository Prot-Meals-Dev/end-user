import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  whyCards = [
    {
      id: 1,
      img: '/why2.png',
      head: 'ORDER WITH',
      head2: 'GREAT OFFERS',
      para: 'Enjoy exclusive discounts and special deals on your favorite healthy meals every day.'
    },
    {
      id: 2,
      img: '/why.png',
      head: 'TRUSTED',
      head2: 'DELIVERY PARTNERS',
      para: 'Reliable and fast delivery service ensuring your meals arrive fresh and on time.'
    },
    {
      id: 3,
      img: '/why1.png',
      head: 'BEST QUALITY',
      head2: 'FOODS',
      para: 'Only the finest ingredients and highest quality standards in every meal we prepare..'
    },
  ]

  testCards = [
    {
      id: 1,
      img: '/test1.png',
      stars: 5,
      name: 'Emily johnson',
      para: 'Protmeals have completely transformed my daily meal routines.This app offers excellent value, convenience, and reliability'
    },
    {
      id: 2,
      img: '/test1.png',
      stars: 5,
      name: 'Rafel johnson',
      para: 'The user interface is clean, intuitive, and easy to navigate. I love how it lets me customize my meal preferences and even select the type of meals I want.'
    },
    {
      id: 3,
      img: '/test1.png',
      stars: 5,
      name: 'Ravi johnson',
      para: 'Its especially helpful for students and working professionals who struggle with timely and healthy food.'
    },
  ]

  createStars(count: number): number[] {
    return Array(count).fill(0);
  }
}
