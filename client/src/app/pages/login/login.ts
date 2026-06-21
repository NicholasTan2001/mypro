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
import { HttpClient } from '@angular/common/http';
import { DeleteAcccountService } from '../../services/delete-account.service';
import { API_CONFIG } from '../../config/api.config';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-login',
  imports: [Button, RouterLink, Reveal, InputComponent, CommonModule, FormsModule, TranslateModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  form = {
    IdentityNumber: '',
    Password: '',
    Country: 'Malaysia',
  };

  form2 = {
    IdentityNumber: '',
  }

  blockedAccountSuccess: boolean = false;
  deleteAccountSuccess: boolean = false;
  logoutSuccess: boolean = false;
  resetPasswordSuccess: boolean = false;
  isLoading: boolean = false;
  isLoading2: boolean = false;
  identityNumberError: string = '';
  identityNumberError2: string = '';
  passwordError: string = '';
  language: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private logoutService: LogoutService,
    private deleteAccountService: DeleteAcccountService,
    private translate: TranslateService,
    public languageService: LanguageService

  ) { }

  ngOnInit() {
    this.language = this.languageService.currentLanguage;
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
    this.language = this.languageService.currentLanguage;
    try {
      if (!this.form.IdentityNumber) {
        this.identityNumberError = this.translate.instant('login.errorid1');
        this.isLoading = false;
        return;
      }
      if (!/^\d{12}$/.test(this.form.IdentityNumber)) {
        this.identityNumberError = this.translate.instant('login.errorid2');
        this.isLoading = false;
        return;
      }
      if (!this.form.Password) {
        this.passwordError = this.translate.instant('login.errorpassword1');
        this.isLoading = false;
        return;
      }
      if (this.form.Password.length < 8) {
        this.passwordError = this.translate.instant('login.errorpassword2');
        this.isLoading = false;
        return;
      }
      const response = await firstValueFrom(this.authService.login(this.form, this.language));
      this.authService.setToken(response.token, response.user);
      this.router.navigate(['/myprofile']);
    } catch (error: any) {
      if (error.error.message == "Blocked Account") {
        this.blockedAccountSuccess = true;
        this.cd.detectChanges();
        return;
      }
      const message = error?.error?.message || 'Login failed. Please try again.';
      if (message == "Invalid credentials.") {
        this.passwordError = this.translate.instant('login.errorpassword3');
      }
      this.isLoading = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
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

  async onSubmit2() {
    this.isLoading2 = true;
    this.identityNumberError2 = '';
    this.language = this.languageService.currentLanguage;

    try {
      if (!this.form2.IdentityNumber) {
        this.identityNumberError2 = this.translate.instant('login.errorid1');
        this.isLoading2 = false;
        return;
      }
      if (!/^\d{12}$/.test(this.form2.IdentityNumber)) {
        this.identityNumberError2 = this.translate.instant('login.errorid2');
        this.isLoading2 = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/forgot-password`,
          {
            identityNumber: this.form2.IdentityNumber,
            language: this.language
          }
        )
      );
      if (response) {
        this.form2.IdentityNumber = '';
        this.isLoading2 = false;
        this.resetPasswordSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isLoading2 = false;
      const message = error?.error?.message || 'Failed to send reset instructions. Please try again.';
      if (message == "Identity number not found.") {
        this.identityNumberError2 = this.translate.instant('login.errorid3');
      }
      this.cd.detectChanges();
    } finally {
      this.isLoading2 = false;
      this.cd.detectChanges();
    }
  }

  closeResetPassword() {
    this.resetPasswordSuccess = false;
  }

  closeBlocked() {
    this.blockedAccountSuccess = false;
  }

}