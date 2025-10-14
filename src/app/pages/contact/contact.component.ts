import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../shared/components/alert/service/alert.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      const message = `Hello! 👋%0A
Name: ${formData.firstName} ${formData.lastName}%0A
Phone: ${formData.phone}%0A
Email: ${formData.email}%0A
Message: ${formData.message}`;

      const phoneNumber = '917907656168';
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappURL, '_blank');

      this.alertService.showAlert({
        message: 'Form submitted successfully!',
        type: 'success',
        autoDismiss: true,
        duration: 4000
      });
      this.contactForm.reset();
    } else {
      this.alertService.showAlert({
        message: 'Please fill in all required fields and agree to the terms.',
        type: 'error',
        autoDismiss: true,
        duration: 4000
      });
    }
  }

}
