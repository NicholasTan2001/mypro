import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../component/input/input';
import { RouterLink } from '@angular/router';
import { Button } from "../../component/button/button";
import { firstValueFrom } from "rxjs";
import { CommonModule } from "@angular/common";
import { Reveal } from "../../directive/reveal";
import { ChangeDetectorRef } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, InputComponent, RouterLink, Button, CommonModule, Reveal],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {

  form = {
    IdentityNumber: '',
    Name: '',
    Age: '',
    Password: '',
    ConfirmPassword: '',
    Country: 'Malaysia',
    Email: '',
    PhoneNumber: '',
    Sex: 'Male',
    Address: '',
    BirthDate: null,
  };

  identityNumberError: string = '';
  nameError: string = '';
  ageError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  phoneNumberError: string = '';
  emailError: string = '';
  addressError: string = '';
  birthDateError: string = ''
  registerSuccess: boolean = false;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  async onSubmit() {
    this.isLoading = true;
    this.identityNumberError = '';
    this.nameError = '';
    this.ageError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.emailError = '';
    this.phoneNumberError = '';
    this.addressError = '';
    this.birthDateError = '';
    try {
      if (!this.form.IdentityNumber) {
        this.identityNumberError = 'Identity number is required.';
        this.isLoading = false;
        return;
      }
      if (!/^\d{12}$/.test(this.form.IdentityNumber)) {
        this.identityNumberError = 'Valid identity number is required.';
        this.isLoading = false;
        return;
      }
      if (!this.form.Name) {
        this.nameError = 'Name is required.';
        this.isLoading = false;
        return;
      }
      if (!this.form.Age) {
        this.ageError = 'Age is required.';
        this.isLoading = false;
        return;
      }
      if (Number(this.form.Age) <= 0 || Number(this.form.Age) > 120 || isNaN(Number(this.form.Age))) {
        this.ageError = 'Valid age is required.';
        this.isLoading = false;
        return;
      }
      if (!this.form.BirthDate) {
        this.birthDateError = 'Date of birth is required.';
        this.isLoading = false;
        return;
      }
      if (!this.form.Email) {
        this.ageError = 'Email is required.';
        this.isLoading = false;
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.Email)) {
        this.emailError = 'Valid email is required.';
        this.isLoading = false;
        return;
      }
      if (!this.form.PhoneNumber) {
        this.phoneNumberError = 'Phone number is required.';
        this.isLoading = false;
        return;
      }
      if (!/^\d{10}$/.test(this.form.PhoneNumber)) {
        this.phoneNumberError = 'Valid phone number is required.';
        this.isLoading = false;
        return;
      }
      if (!this.form.Password) {
        this.passwordError = 'Password is required.';
        this.isLoading = false;
        return;
      }
      if (this.form.Password.length < 8) {
        this.passwordError = 'Password must be at least 8 characters long.';
        this.isLoading = false;
        return;
      }
      if (this.form.Password !== this.form.ConfirmPassword) {
        this.confirmPasswordError = 'Passwords do not match.';
        this.isLoading = false;
        return;
      }
      if (!this.form.Address) {
        this.addressError = 'Address is required.';
        this.isLoading = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/register`,
          this.form,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      );
      if (response) {
        this.isLoading = false;
        this.registerSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isLoading = false;
      console.log('Register error:', error);
      const message = error?.error?.message || 'Registration failed. Please try again.';
      this.identityNumberError = message;
      this.cd.detectChanges();
    }
  }

  loginPage() {
    this.router.navigate(['/login']);
  }

}