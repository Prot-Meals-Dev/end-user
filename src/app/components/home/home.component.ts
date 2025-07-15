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
}
