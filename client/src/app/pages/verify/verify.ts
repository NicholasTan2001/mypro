import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { API_CONFIG } from '../../config/api.config';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reveal } from '../../directive/reveal';
import { InputComponent } from '../../component/input/input';
import { Button } from '../../component/button/button';
import { FormsModule } from '@angular/forms';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { privateDecrypt } from 'crypto';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-verify',
  imports: [CommonModule, Reveal, InputComponent, Button, FormsModule, TranslateModule],
  standalone: true,
  templateUrl: './verify.html',
  styleUrl: './verify.css'
})
export class Verify implements OnInit {

  form = {
    name: '',
    verificationId: '',
    createdAt: '',
    expiredAt: ''
  }

  form2 = {
    password: ''
  }

  password: string = '';
  isLoading: boolean = false;
  passwordError: string = '';
  otp: string = '';
  language: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    public languageService: LanguageService

  ) { }

  ngOnInit() {
    this.loadVerification();
  }

  async loadVerification() {
    this.language = this.languageService.currentLanguage;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;
      this.form.name = user.name;
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.usersEndpointBase}/verification/${user.id}/${this.language}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response.id >= 0) {
        this.form.verificationId = response.id;
        this.form.createdAt = response.createdAt;
        this.form.expiredAt = response.expiredAt;
        this.otp = response.password;
        this.cd.detectChanges();
      } else {
        this.router.navigate(['/myprofile']);
        this.cd.detectChanges();
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load verification:', error);
    }
  }

  async onSubmit() {
    this.passwordError = '';
    this.isLoading = true;
    if (!this.form2.password) {
      this.passwordError = this.translate.instant('verify.errorpassword1');
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    if (this.form2.password.length < 6) {
      this.passwordError = this.translate.instant('verify.errorpassword2');
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    if (this.form2.password != this.otp) {
      this.passwordError = this.translate.instant('verify.errorpassword3');
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    if (new Date(this.form.expiredAt).getTime() < new Date().getTime()) {
      this.passwordError = this.translate.instant('verify.errorpassword4');
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    if (this.form2.password == this.otp) {
      try {
        const response = await firstValueFrom(
          this.http.delete(
            `${API_CONFIG.usersEndpointBase}/delete-verification/${this.form.verificationId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authService.getToken()}`
              }
            }
          )
        );
        if (response) {
          this.router.navigate(['/myprofile']);
          this.isLoading = false;
          this.cd.detectChanges();
        }
      } catch (error: any) {
        this.isLoading = false;
        this.cd.detectChanges();
      } finally {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    }
  }

}