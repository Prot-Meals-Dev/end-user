import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../../components/login/login.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(
    private modalService: NgbModal
  ) { }

  openLogin() {
    const buttonElement = document.activeElement as HTMLElement
    buttonElement.blur();

    let modalRef = this.modalService.open(LoginComponent, { centered: true, backdrop: 'static' })
  }
}
