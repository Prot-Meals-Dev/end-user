import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/interceptor/auth.service';
import { AlertService } from '../../shared/components/alert/service/alert.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isLogin = true;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpForm: FormGroup;
  signupForm: FormGroup;

  isOtpSent = false;
  isSendingOtp = false;
  counter = 90;
  countdownDisplay = '1:30';
  intervalId: any;
  allRegions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal,
    private service: LoginService
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

  ngOnInit(): void {
    this.loadRegions()
  }

  loadRegions() {
    this.service.getRegions().subscribe({
      next: (res: any) => {
        this.allRegions = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  get otpArray(): FormArray<FormControl<string>> {
    return this.otpForm.get('otp') as FormArray<FormControl<string>>;
  }

  sendOtp() {
  const emailControl = this.otpForm.get('email');

  if (this.otpForm.invalid) {
    this.otpForm.markAllAsTouched();   // ⭐ safer
    return;
  }


  if (this.isOtpSent || this.isSendingOtp) return;

  const email = emailControl?.value;
  this.startOtpFlow(email);
}

  resendOtp() {
    if (this.isSendingOtp) return;

    const email = this.otpForm.get('email')?.value;
    this.startOtpFlow(email);
  }

  startOtpFlow(email: string) {
    this.isSendingOtp = true;

    this.authService.requestOtp(email).subscribe({
      next: (res: any) => {
        console.log(res);
        const message = res.data.otp ? `OTP is :- ${res.data.otp}` : res.data?.message || 'Something went wrong';
        this.isOtpSent = true;
        this.isOtpSent = true;
        this.alertService.showAlert({
          message: message,
          type: 'info',
          autoDismiss: true,
          duration: 6000
        });
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
        this.otpForm.get('email')?.enable();
        this.alertService.showAlert({
          message: err.error.message || 'OTP generation failed',
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      },
      complete: () => {
        this.isSendingOtp = false;
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
      const rawValue = this.otpForm.getRawValue();
      const email = rawValue.email;
      const otpValue = rawValue.otp.join('');

      this.authService.verifyOtp(email, otpValue).subscribe({
        next: res => {
          this.alertService.showAlert({
            message: 'Log In Success',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
          this.activeModal.close(res.data)
        },
        error: err => {
          this.alertService.showAlert({
            message: err.error.message || 'Log in failed',
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
        }
      });
    }
  }

  onSignupSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;

      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: `+91${formData.phone}`,
        region_id: formData.region,
        address: formData.address
      };

      this.service.signUp(payload).subscribe({
        next: (res: any) => {
          this.alertService.showAlert({
            message: 'Sign up successful!',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
          this.isLogin = true;
          this.isOtpSent = false;
          clearInterval(this.intervalId);
          this.countdownDisplay = '1:30';

          const email = this.signupForm.get('email')?.value;
          this.otpForm.reset();
          this.otpForm.get('email')?.setValue(email);
          this.otpForm.get('email')?.enable();
        },
        error: (err: any) => {
          this.alertService.showAlert({
            message: err.error.message || 'Sign up failed',
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
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

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < this.otpArray.length - 1) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      nextInput.nativeElement.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      prevInput.nativeElement.focus();
      this.otpArray.at(index - 1).setValue('');
    }
  }
}
