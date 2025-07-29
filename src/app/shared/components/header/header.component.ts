import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../../components/login/login.component';
import { AuthService } from '../../../core/interceptor/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.isLoggedIn ? this.authService.getUser() : null;
  }

  logout() {
    this.authService.logout();
    this.checkLoginStatus();
  }

  openLogin() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const modalRef = this.modalService.open(LoginComponent, { centered: true, backdrop: 'static' });
    modalRef.result.then(
      (result) => {
        console.log('Login success response:', result);
        this.checkLoginStatus();
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }

}
