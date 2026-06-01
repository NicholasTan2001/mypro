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
    sex: string;
    address: string;
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
  isLoading2: boolean = false;
  isLoading3: boolean = false;
  nameError: string = '';
  ageError: string = '';
  emailError: string = '';
  phoneNumberError: string = '';
  addressError: string = '';
  updateUserSuccess: boolean = false;

  form = {
    IdentityNumber: '',
    Name: '',
    Age: '',
    Country: '',
    Email: '',
    PhoneNumber: '',
    Sex: '',
    Address: ''
  }

  form2 = {
    Intro: ''
  }

  form3 = {
    Conclusion: ''
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUser();
    this.loadAdditional();
    this.authService.freshLogin$.subscribe(isFreshLogin => {
      this.loginSuccess = isFreshLogin;
    });
  }

  async loadUser() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`
              }
            }
          )
        );

        if (response) {
          this.name = response.name;
          this.form.IdentityNumber = response.identityNumber;
          this.form.Name = response.name;
          this.form.Age = (response.age).toString();
          this.form.Country = response.country;
          this.form.Email = response.email;
          this.form.PhoneNumber = response.phoneNumber;
          this.form.Address = response.address;
          this.form.Sex = response.sex;
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load user information:', error);
      this.cd.detectChanges();
    }
  }

  async loadAdditional() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/additional/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`
              }
            }
          )
        );

        if (response) {
          this.form2.Intro = response.intro;
          this.form3.Conclusion = response.conclusion;
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load additional information:', error);
      this.cd.detectChanges();
    }
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
    this.addressError = '';
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
      if (!this.form.Address) {
        this.addressError = 'Address is required.';
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
            country: this.form.Country,
            sex: this.form.Sex,
            address: this.form.Address
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
        this.loadUser();
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

  async onSubmit2() {
    this.isLoading2 = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.isLoading2 = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-intro`,
          {
            identityNumber: user.identityNumber,
            intro: this.form2.Intro
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
        this.isLoading2 = false;
        this.loadAdditional();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }

    } catch (error: any) {
      this.isLoading2 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading2 = false;
      this.cd.detectChanges();
    }
  }

  async onSubmit3() {
    this.isLoading3 = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.isLoading3 = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-conclusion`,
          {
            identityNumber: user.identityNumber,
            conclusion: this.form3.Conclusion
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
        this.isLoading3 = false;
        this.loadAdditional();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }

    } catch (error: any) {
      this.isLoading3 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading3 = false;
      this.cd.detectChanges();
    }
  }
}