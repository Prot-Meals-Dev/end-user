import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(
    private router: Router
  ) { }

  goTo(path: string) {
    if (path.startsWith('#')) {
      const el = document.querySelector(path);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate([path]);
    }
  }

}
