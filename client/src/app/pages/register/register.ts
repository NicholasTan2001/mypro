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
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, InputComponent, RouterLink, Button, CommonModule, Reveal, TranslateModule],
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
    private cd: ChangeDetectorRef,
    private translate: TranslateService
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
        this.identityNumberError = this.translate.instant('register.errorid1');
        this.isLoading = false;
        return;
      }
      if (!/^\d{12}$/.test(this.form.IdentityNumber)) {
        this.identityNumberError = this.translate.instant('register.errorid2');
        this.isLoading = false;
        return;
      }
      if (!this.form.Name) {
        this.nameError = this.translate.instant('register.errorname');
        this.isLoading = false;
        return;
      }
      if (!this.form.Age) {
        this.ageError = this.translate.instant('register.errorage1');
        this.isLoading = false;
        return;
      }
      if (Number(this.form.Age) <= 0 || Number(this.form.Age) > 120 || isNaN(Number(this.form.Age))) {
        this.ageError = this.translate.instant('register.errorage2');
        this.isLoading = false;
        return;
      }
      if (!this.form.BirthDate) {
        this.birthDateError = this.translate.instant('register.errordate');
        this.isLoading = false;
        return;
      }
      if (!this.form.Email) {
        this.ageError = this.translate.instant('register.erroremail1');
        this.isLoading = false;
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.Email)) {
        this.emailError = this.translate.instant('register.erroremail2');
        this.isLoading = false;
        return;
      }
      if (!this.form.PhoneNumber) {
        this.phoneNumberError = this.translate.instant('register.errorphone1');
        this.isLoading = false;
        return;
      }
      if (!/^\d{10}$/.test(this.form.PhoneNumber)) {
        this.phoneNumberError = this.translate.instant('register.errorphone2');
        this.isLoading = false;
        return;
      }
      if (!this.form.Password) {
        this.passwordError = this.translate.instant('register.errorpassword1');
        this.isLoading = false;
        return;
      }
      if (this.form.Password.length < 8) {
        this.passwordError = this.translate.instant('register.errorpassword2');
        this.isLoading = false;
        return;
      }
      if (this.form.Password !== this.form.ConfirmPassword) {
        this.confirmPasswordError = this.translate.instant('register.errorconfirmpassword');
        this.isLoading = false;
        return;
      }
      if (!this.form.Address) {
        this.addressError = this.translate.instant('register.erroraddress');
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
      const message = error?.error?.message || 'Registration failed. Please try again.';
      if (message == "Identity number already registered.") {
        this.identityNumberError = this.translate.instant('register.errorid3');
      }
      this.cd.detectChanges();
    }
  }

  loginPage() {
    this.router.navigate(['/login']);
  }

}