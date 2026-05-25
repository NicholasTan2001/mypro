import { Component, OnInit } from '@angular/core';
import { Button } from '../../component/button/button';
import { Router, RouterLink } from '@angular/router';
import { Reveal } from '../../directive/reveal';
import { InputComponent } from '../../component/input/input';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { LogoutService } from '../../services/logout.service';
import { DeleteAcccountService } from '../../services/delete-account.service';

@Component({
  selector: 'app-login',
  imports: [Button, RouterLink, Reveal, InputComponent, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  form = {
    IdentityNumber: '',
    Password: '',
    Country: 'Malaysia'
  };

  deleteAccountSuccess: boolean = false;
  logoutSuccess: boolean = false;
  isLoading: boolean = false;
  identityNumberError: string = '';
  passwordError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private logoutService: LogoutService,
    private deleteAccountService: DeleteAcccountService
  ) { }

  ngOnInit() {

    this.logoutService.logoutSuccess$.subscribe(success => {
      this.logoutSuccess = success;
    });

    this.deleteAccountService.deleteAccountSuccess$.subscribe(success => {
      this.deleteAccountSuccess = success;
    })

  }

  async onSubmit() {

    this.isLoading = true;
    this.identityNumberError = '';
    this.passwordError = '';

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

      const response = await firstValueFrom(this.authService.login(this.form));
      this.authService.setToken(response.token, response.user);
      this.router.navigate(['/myprofile']);

    } catch (error: any) {

      const message = error?.error?.message || 'Login failed. Please try again.';
      this.passwordError = message;
      this.isLoading = false;
      this.cd.detectChanges();

    } finally {

      this.isLoading = false;

    }
  }

  closeLogout() {

    this.logoutSuccess = false;
    this.logoutService.hideLogoutSuccess();

  }

  closeDeleteAccount() {

    this.deleteAccountSuccess = false;
    this.deleteAccountService.hideDeleteAccountSuccess();

  }
}