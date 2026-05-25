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

  deleteSuccess: boolean = false;

  identityNumber: string = '';
  isLoading: boolean = false;
  passwordError: string = "";

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
}