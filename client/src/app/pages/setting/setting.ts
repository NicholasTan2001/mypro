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
import { API_CONFIG } from '../../config/api.config';
import { Toggleswitch } from '../../component/toggleswitch/toggleswitch';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-setting',
  imports: [Reveal, InputComponent, Button, CommonModule, FormsModule, Toggleswitch, TranslateModule],
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

  updatePendingBlueTickSuccess: boolean = false;
  deleteSuccess: boolean = false;
  identityNumber: string = "";
  status: string = "";
  verify: string = "";
  notification: string = "";
  isLoading: boolean = false;
  isLoading2: boolean = false;
  isLoading3: boolean = false;
  passwordError: string = "";
  passwordError2: string = "";
  newPasswordError: string = "";
  confirmNewPasswordError: string = "";
  updatePasswordSuccess: boolean = false;
  isPrivate: boolean = false;
  isVerify: boolean = false;
  isBlueTick: string = "";
  isNotification: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private deleteAccountService: DeleteAcccountService,
    private translate: TranslateService

  ) { }

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.identityNumber = user.identityNumber;
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
          this.status = response.status;
          this.isPrivate = this.status === 'Private';
          this.verify = response.verify;
          this.isVerify = this.verify === 'Yes';
          this.isBlueTick = response.blueTick;
          this.notification = response.notification;
          this.isNotification = this.notification === 'Yes';
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load intro:', error);
      this.cd.detectChanges();
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.passwordError = "";
    try {
      if (!this.form.Password) {
        this.passwordError = this.translate.instant('setting.errorpassword1');
        this.isLoading = false;
        return;
      }
      if (this.form.Password.length < 8) {
        this.passwordError = this.translate.instant('setting.errorpassword2');
        this.isLoading = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/delete-account`,
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
      if (message == "Invalid password.") {
        this.passwordError = this.translate.instant('setting.errorpassword5');
      }
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
        this.passwordError2 = this.translate.instant('setting.errorpassword3');
        this.isLoading2 = false;
        return;
      }
      if (this.form2.Password.length < 8) {
        this.passwordError2 = this.translate.instant('setting.errorpassword4');
        this.isLoading2 = false;
        return;
      }
      if (!this.form2.NewPassword) {
        this.newPasswordError = this.translate.instant('setting.errornewpassword1');
        this.isLoading2 = false;
        return;
      }
      if (this.form2.NewPassword.length < 8) {
        this.newPasswordError = this.translate.instant('setting.errornewpassword2');
        this.isLoading2 = false;
        return;
      }
      if (!this.form2.ConfirmNewPassword) {
        this.confirmNewPasswordError = this.translate.instant('setting.errorconfirmpassword1');
        this.isLoading2 = false;
        return;
      }
      if (this.form2.NewPassword !== this.form2.ConfirmNewPassword) {
        this.confirmNewPasswordError = this.translate.instant('setting.errorconfirmpassword2');
        this.isLoading2 = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/change-password`,
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
      if (message == "Invalid password.") {
        this.passwordError2 = this.translate.instant('setting.errorpassword5');
      } this.cd.detectChanges();
    } finally {
      this.isLoading2 = false;
      this.cd.detectChanges();
    }
  }

  loginPage() {
    this.authService.logout();
  }

  async onToggleNotificationMode(value: boolean) {
    this.isNotification = value;
    this.notification = value ? 'Yes' : 'No';
    await this.updateNotification(this.notification);
  }

  async updateNotification(newNotification: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-notification`,
          {
            identityNumber: this.identityNumber,
            notification: newNotification
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
        this.isNotification = response.notification == 'Yes';
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isNotification = newNotification == 'Yes';
      this.cd.detectChanges();
    } finally {
      this.isNotification = newNotification == 'Yes';
      this.cd.detectChanges();
    }
  }

  async onTogglePrivateMode(value: boolean) {
    this.isPrivate = value;
    this.status = value ? 'Private' : 'Public';
    await this.updateStatus(this.status);
  }

  async updateStatus(newStatus: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-status`,
          {
            identityNumber: this.identityNumber,
            status: newStatus
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
        this.isPrivate = response.status == 'Private';
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isPrivate = newStatus == 'Private';
      this.cd.detectChanges();
    } finally {
      this.isPrivate = newStatus == 'Private';
      this.cd.detectChanges();
    }
  }

  async onToggleVerifyMode(value: boolean) {
    this.isVerify = value;
    this.verify = value ? 'Yes' : 'No';
    await this.updateVerify(this.verify);
  }

  async updateVerify(newVerify: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-verify`,
          {
            identityNumber: this.identityNumber,
            verify: newVerify
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
        this.isVerify = response.Verify == 'Yes';
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isVerify = newVerify == 'Yes';
      this.cd.detectChanges();
    } finally {
      this.isVerify = newVerify == 'Yes';
      this.cd.detectChanges();
    }
  }

  async onVerify() {
    this.isLoading3 = true;
    try {
      const response: any = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-pending-bluetick`,
          {
            identityNumber: this.identityNumber,
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
        this.updatePendingBlueTickSuccess = true;
        this.isLoading3 = false;
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

  closePendingBlueTickModal() {
    this.updatePendingBlueTickSuccess = false;

  }

}