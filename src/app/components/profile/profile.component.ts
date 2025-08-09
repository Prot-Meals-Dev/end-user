import { Component, OnInit } from '@angular/core';
import { ProfileService } from './service/profile.service';
import { AuthService } from '../../core/interceptor/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/components/alert/service/alert.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  profile!: any;
  isLoading = true;
  profileForm!: FormGroup;
  isEditMode = false;

  constructor(
    private service: ProfileService,
    private authService: AuthService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getProfile()
  }

  getProfile() {
    const pro = this.authService.getUser()
    this.service.getUser(pro.id).subscribe({
      next: (res: any) => {
        this.profile = res.data;
        this.initForm();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    })
  }

  initForm() {
    const phonePattern = /^(\+91)?[6-9]\d{9}$/;

    this.profileForm = this.fb.group({
      name: [this.profile?.name || '', Validators.required],
      email: [this.profile?.email || '', [Validators.required, Validators.email]],
      phone: [this.profile?.phone || '', [Validators.required, Validators.pattern(phonePattern)]],
      address: [this.profile?.address || '', Validators.required]
    });
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.initForm();
    }
  }

  cancelEdit() {
    this.isEditMode = false;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.value;
      this.service.updateUser(updatedProfile).subscribe({
        next: (res: any) => {
          this.profile = res.data;
          this.isEditMode = false;
          this.alertService.showAlert({
            message: 'Profile updated!',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
        },
        error: (err: any) => {
          console.error('Update failed', err);
          this.alertService.showAlert({
            message: 'Update failed',
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
        }
      });
    }
  }

}
