import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Button } from '../../component/button/button';
import { Reveal } from '../../directive/reveal';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../component/input/input';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';

interface UpdateProfileResponse {
  message: string;
  user: {
    id: number;
    name: string;
    age: number;
    identityNumber: string;
    country: string;
    email: string;
    phoneNumber: string;
  };
}

@Component({
  selector: 'app-myprofile',
  imports: [CommonModule, Button, Reveal, FormsModule, InputComponent],
  standalone: true,
  templateUrl: './myprofile.html',
  styleUrl: './myprofile.css',
})

export class Myprofile implements OnInit {

  name: string = '';
  loginSuccess: boolean = false;
  isLoading: boolean = false;
  nameError: string = '';
  ageError: string = '';
  emailError: string = '';
  phoneNumberError: string = '';
  updateUserSuccess: boolean = false;

  form = {
    IdentityNumber: '',
    Name: '',
    Age: '',
    Country: '',
    Email: '',
    PhoneNumber: '',
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.name = user.name;
      this.form.IdentityNumber = user.identityNumber;
      this.form.Name = user.name;
      this.form.Age = (user.age).toString();
      this.form.Country = user.country;
      this.form.Email = user.email;
      this.form.PhoneNumber = user.phoneNumber;
    }
    this.authService.freshLogin$.subscribe(isFreshLogin => {
      this.loginSuccess = isFreshLogin;
    });
  }

  closeLoginSuccessModal() {
    this.loginSuccess = false;
    this.authService.clearFreshLogin();
  }

  async onSubmit() {
    this.isLoading = true;
    this.nameError = '';
    this.ageError = '';
    this.emailError = '';
    this.phoneNumberError = '';
    try {
      if (!this.form.Name) {
        this.nameError = 'Name is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form.Age) {
        this.ageError = 'Age is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (Number(this.form.Age) <= 0 || Number(this.form.Age) > 120 || isNaN(Number(this.form.Age))) {
        this.ageError = 'Valid age is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form.Email) {
        this.emailError = 'Email is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.Email)) {
        this.emailError = 'Valid email is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form.PhoneNumber) {
        this.phoneNumberError = 'Phone number is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!/^\d{10}$/.test(this.form.PhoneNumber)) {
        this.phoneNumberError = 'Valid phone number is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      const response = await firstValueFrom(
        this.http.put<UpdateProfileResponse>(
          `${API_CONFIG.usersEndpointBase}/update-profile`,
          {
            identityNumber: this.form.IdentityNumber,
            name: this.form.Name,
            age: Number(this.form.Age),
            email: this.form.Email,
            phoneNumber: this.form.PhoneNumber,
            country: this.form.Country
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response) {
        const updatedUser = {
          identityNumber: this.form.IdentityNumber,
          name: this.form.Name,
          age: Number(this.form.Age),
          email: this.form.Email,
          phoneNumber: this.form.PhoneNumber,
          country: this.form.Country,
        };
        this.authService.updateCurrentUser(updatedUser);
        this.form.Name = updatedUser.name;
        this.isLoading = false;
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isLoading = false;
      const message = error?.error?.message || 'Failed to update profile. Please try again.';
      this.nameError = message;
      this.cd.detectChanges();
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  closeUpdateUserModal() {
    this.updateUserSuccess = false;
  }
}