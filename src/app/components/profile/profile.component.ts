import { Component, OnInit } from '@angular/core';
import { ProfileService } from './service/profile.service';
import { AuthService } from '../../core/interceptor/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  profile!: any;

  constructor(
    private service: ProfileService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getProfile()
  }

  getProfile() {
    const pro = this.authService.getUser()
    this.service.getUser(pro.id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.profile = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

}
