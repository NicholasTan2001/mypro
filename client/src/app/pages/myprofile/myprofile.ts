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
  isLoading4: boolean = false;
  nameError: string = '';
  ageError: string = '';
  emailError: string = '';
  phoneNumberError: string = '';
  addressError: string = '';
  updateUserSuccess: boolean = false;
  courseError: string = '';
  locationError: string = '';
  studentDateError: string = '';
  roleError: string = '';
  companyError: string = '';
  empDateError: string = '';
  responsibleError: string = '';

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

  form4 = {
    Position: 'Student'
  }

  form5 = {
    Course: '',
    Location: '',
    StartDate: '',
    EndDate: '',
  }

  form6 = {
    Role: '',
    Company: '',
    Responsible: '',
    StartDate: '',
    EndDate: '',
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUser();
    this.loadAdditional();
    this.loadPosition();
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

  async loadPosition() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/position/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`
              }
            }
          )
        );

        if (response) {
          this.form4.Position = response.position;
          if (response.position === 'Employee' || response.position === 'Employer') {
            this.form6.Role = response.role || '';
            this.form6.Company = response.company || '';
            this.form6.Responsible = response.responsible || '';
            this.form6.StartDate = response.startDate
              ? response.startDate.split('T')[0]
              : '';

            this.form6.EndDate = response.endDate
              ? response.endDate.split('T')[0]
              : '';
            this.form6.Responsible = response.responsible || '';
          } else if (response.position === 'Student') {

            this.form5.Course = response.course || '';
            this.form5.Location = response.location || '';
            this.form5.StartDate = response.startDate
              ? response.startDate.split('T')[0]
              : '';

            this.form5.EndDate = response.endDate
              ? response.endDate.split('T')[0]
              : '';
          }
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load position:', error);
      this.form4.Position = 'Student';
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

  async onSubmit4() {
    this.isLoading4 = true;
    this.courseError = '';
    this.locationError = '';
    this.studentDateError = '';
    this.roleError = '';
    this.companyError = '';
    this.empDateError = '';
    this.responsibleError = '';
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.isLoading4 = false;
      this.cd.detectChanges();
      return;
    }
    const position = this.form4.Position;
    if (position === 'Student') {
      try {
        if (!this.form5.Course) {
          this.courseError = 'Course is required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form5.Location) {
          this.locationError = 'Location is required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form5.StartDate || !this.form5.EndDate || this.form5.StartDate >= this.form5.EndDate) {
          this.studentDateError = 'Valid dates are required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        const response = await firstValueFrom(
          this.http.put(
            `${API_CONFIG.usersEndpointBase}/update-student`,
            {
              identityNumber: user.identityNumber,
              course: this.form5.Course,
              location: this.form5.Location,
              startDate: this.form5.StartDate,
              endDate: this.form5.EndDate
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
          this.isLoading4 = false;
          this.loadPosition();
          this.updateUserSuccess = true;
          this.cd.detectChanges();
        }
      } catch (error: any) {
        this.isLoading4 = false;
        this.cd.detectChanges();
      } finally {
        this.isLoading4 = false;
        this.cd.detectChanges();
      }
    }
    else if (position === 'Employee' || position === 'Employer') {
      try {
        if (!this.form6.Role) {
          this.roleError = 'Role is required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form6.Responsible) {
          this.responsibleError = 'Responsibilities are required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form6.Company) {
          this.companyError = 'Company is required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form6.StartDate || !this.form6.EndDate || this.form6.StartDate >= this.form6.EndDate) {
          this.empDateError = 'Valid dates are required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        const response = await firstValueFrom(
          this.http.put(
            `${API_CONFIG.usersEndpointBase}/update-organization`,
            {
              position: position,
              identityNumber: user.identityNumber,
              role: this.form6.Role,
              company: this.form6.Company,
              startDate: this.form6.StartDate,
              endDate: this.form6.EndDate,
              responsible: this.form6.Responsible
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
          this.isLoading4 = false;
          this.loadPosition();
          this.updateUserSuccess = true;
          this.cd.detectChanges();
        }
      } catch (error: any) {
        this.isLoading4 = false;
        this.cd.detectChanges();
      } finally {
        this.isLoading4 = false;
        this.cd.detectChanges();
      }
    }
  }
}

