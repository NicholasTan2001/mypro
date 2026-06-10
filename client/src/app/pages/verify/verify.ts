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

@Component({
  selector: 'app-verify',
  imports: [CommonModule, Reveal, InputComponent, Button, FormsModule],
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

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadVerification();
  }

  async loadVerification() {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;
      this.form.name = user.name;
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.usersEndpointBase}/verification/${user.id}`,
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
      this.passwordError = "OTP password is required.";
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    if (this.form2.password.length < 6) {
      this.passwordError = "Valid OTP password is required.";
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    if (this.form2.password != this.otp) {
      this.passwordError = "OTP password is wrong.";
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    if (new Date(this.form.expiredAt).getTime() < new Date().getTime()) {
      this.passwordError = "OTP Password is expired.";
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