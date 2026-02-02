import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../../components/login/login.component';
import { AuthService } from '../../../core/interceptor/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  user: any = null;

  menuOpen = false;
  dropdownOpen = false;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.isLoggedIn ? this.authService.getUser() : null;
  }

  /* ⭐ IMPROVED */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    // Close dropdown if menu closes
    if(!this.menuOpen){
      this.dropdownOpen = false;
    }
  }

  /* ⭐ IMPROVED */
  toggleDropdown() {

    // Prevent dropdown opening when menu is closed on mobile
    if(!this.menuOpen && window.innerWidth < 768){
      return;
    }

    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.checkLoginStatus();
    this.menuOpen = false;   // ⭐ close mobile menu
  }

  openLogin() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const modalRef = this.modalService.open(LoginComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.result.then(
      () => this.checkLoginStatus(),
      () => {}
    );

    this.menuOpen = false; // ⭐ close mobile menu
  }

  /* ⭐ VERY IMPORTANT */
  goTo(link: string) {
    this.router.navigate([link]);

    this.menuOpen = false;      // close hamburger
    this.dropdownOpen = false;  // close dropdown
  }

  /* ⭐ VERY IMPORTANT */
  scrollToSection(sectionId: string) {
    this.viewportScroller.scrollToAnchor(sectionId);

    this.menuOpen = false;
  }

}
