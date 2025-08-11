import { CommonModule, Location  } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fail',
  imports: [CommonModule],
  templateUrl: './fail.component.html',
  styleUrl: './fail.component.css'
})
export class FailComponent implements OnInit {
  showGoHomeBtn = false;

  constructor(private location: Location, private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showGoHomeBtn = true;
    }, 1000);
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
