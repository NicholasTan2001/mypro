import { Component, OnInit } from '@angular/core';
import { Reveal } from '../../directive/reveal';
import { InputComponent } from '../../component/input/input';
import { Button } from '../../component/button/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DeleteAcccountService } from '../../services/delete-account.service';

@Component({
  selector: 'app-setting',
  imports: [Reveal, InputComponent, Button, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './setting.html',
  styleUrl: './setting.css',
})

export class Setting implements OnInit {

  form = {
    Password: '',
  }

  form2 = {
    Password: '',
    NewPassword: '',
    ConfirmNewPassword: ''
  }

  deleteSuccess: boolean = false;
  identityNumber: string = '';
  isLoading: boolean = false;
  isLoading2: boolean = false;
  passwordError: string = "";
  passwordError2: string = "";
  newPasswordError: string = "";
  confirmNewPasswordError: string = "";
  updatePasswordSuccess: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private deleteAccountService: DeleteAcccountService
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.identityNumber = user.identityNumber;
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.passwordError = "";
    try {
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
      const response = await firstValueFrom(
        this.http.post(
          'http://localhost:5284/api/users/delete-account',
          {
            identityNumber: this.identityNumber,
            password: this.form.Password
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
        this.deleteAccountService.showDeleteAccountSuccess();
        this.authService.logout();
      }
    } catch (error: any) {
      this.isLoading = false;
      const message = error?.error?.message || 'Failed to delete account. Please try again.';
      this.passwordError = message;
      this.cd.detectChanges();
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit2() {
    this.isLoading2 = true;
    this.passwordError2 = "";
    this.newPasswordError = "";
    this.confirmNewPasswordError = "";
    try {
      if (!this.form2.Password) {
        this.passwordError2 = 'Current password is required.';
        this.isLoading2 = false;
        return;
      }
      if (this.form2.Password.length < 8) {
        this.passwordError2 = 'Password must be at least 8 characters long.';
        this.isLoading2 = false;
        return;
      }
      if (!this.form2.NewPassword) {
        this.newPasswordError = 'New password is required.';
        this.isLoading2 = false;
        return;
      }
      if (this.form2.NewPassword.length < 8) {
        this.newPasswordError = 'New password must be at least 8 characters long.';
        this.isLoading2 = false;
        return;
      }
      if (!this.form2.ConfirmNewPassword) {
        this.confirmNewPasswordError = 'Confirm password is required.';
        this.isLoading2 = false;
        return;
      }
      if (this.form2.NewPassword !== this.form2.ConfirmNewPassword) {
        this.confirmNewPasswordError = 'Passwords do not match.';
        this.isLoading2 = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.post(
          'http://localhost:5284/api/users/change-password',
          {
            identityNumber: this.identityNumber,
            password: this.form2.Password,
            newPassword: this.form2.NewPassword
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
        this.form2 = {
          Password: '',
          NewPassword: '',
          ConfirmNewPassword: ''
        };
        this.isLoading2 = false;
        this.updatePasswordSuccess = true;
      }
    } catch (error: any) {
      this.isLoading2 = false;
      const message = error?.error?.message || 'Failed to change password. Please try again.';
      this.passwordError2 = message;
      this.cd.detectChanges();
    } finally {
      this.isLoading2 = false;
      this.cd.detectChanges();
    }
  }

  loginPage() {
    this.authService.logout();
  }

}