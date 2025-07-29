import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/interceptor/auth.service';
import { AlertService } from '../../shared/components/alert/service/alert.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isLogin = true;

  otpForm: FormGroup;
  signupForm: FormGroup;

  isOtpSent = false;
  counter = 90;
  countdownDisplay = '1:30';
  intervalId: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal
  ) {
    this.otpForm = this.fb.group({
      email: this.fb.control(
        { value: '', disabled: false },
        [Validators.required, Validators.email]
      ),
      otp: this.fb.array(Array(6).fill('').map(() => this.fb.control('', Validators.required)))
    });

    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      region: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  get otpArray(): FormArray<FormControl<string>> {
    return this.otpForm.get('otp') as FormArray<FormControl<string>>;
  }

  sendOtp() {
    if (this.otpForm.get('email')?.invalid || this.isOtpSent) return;

    const email = this.otpForm.get('email')?.value;
    this.startOtpFlow(email);
  }

  resendOtp() {
    const email = this.otpForm.get('email')?.value;
    this.startOtpFlow(email);
  }

  startOtpFlow(email: string) {
    this.authService.requestOtp(email).subscribe({
      next: () => {
        this.isOtpSent = true;
        this.otpForm.get('email')?.disable();
        this.counter = 90;
        this.updateCountdown();
        this.intervalId = setInterval(() => {
          this.counter--;
          this.updateCountdown();
          if (this.counter <= 0) {
            clearInterval(this.intervalId);
            this.countdownDisplay = 'Available now';
            this.otpForm.get('email')?.enable();
          }
        }, 1000);
      },
      error: err => {
        console.error('OTP generation failed', err);
        this.otpForm.get('email')?.enable();
        this.alertService.showAlert({
          message: err.error.message || 'Update failed',
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

  updateCountdown() {
    const minutes = Math.floor(this.counter / 60);
    const seconds = this.counter % 60;
    this.countdownDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const { email, otp } = this.otpForm.value;
      const otpValue = otp.join('');

      this.authService.verifyOtp(email, otpValue).subscribe({
        next: res => {
          console.log('Login success:', res);
          // Navigate or update UI here
        },
        error: err => {
          console.error('OTP verification failed', err);
          // optionally show a toast here
        }
      });
    }
  }

  onSignupSubmit() {
    if (this.signupForm.valid) {
      console.log('Sign Up Data:', this.signupForm.value);
    }
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.isOtpSent = false;
    clearInterval(this.intervalId);
    this.countdownDisplay = '1:30';
    this.otpForm.get('email')?.enable();
  }

  closePopup() {
    this.activeModal.close();
  }
}
