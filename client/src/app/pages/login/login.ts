import { Component } from '@angular/core';
import { Button } from '../../component/button/button';
import { Router, RouterLink } from '@angular/router';
import { Reveal } from '../../directive/reveal';
import { InputComponent } from '../../component/input/input';
import { CommonModule } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from "rxjs";
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [Button, RouterLink, Reveal, InputComponent, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  form = {
    IdentityNumber: '',
    Password: '',
    Country: 'Malaysia'
  };

  isLoading: boolean = false;

  identityNumberError: string = '';
  passwordError: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  async onSubmit() {

    this.isLoading = true;

    this.identityNumberError = '';
    this.passwordError = '';

    try {

      if (!this.form.IdentityNumber) {

        this.identityNumberError = 'Identity number is required.';
        return;

      }

      if (!/^\d{12}$/.test(this.form.IdentityNumber)) {

        this.identityNumberError = 'Valid identity number is required.';
        return;

      }

      if (!this.form.Password) {

        this.passwordError = 'Password is required.';
        return;

      }

      if (this.form.Password.length < 8) {

        this.passwordError = 'Password must be at least 8 characters long.';
        return;

      }

      const response = await firstValueFrom(
        this.http.post(
          'http://localhost:5284/api/users/login',
          this.form,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      );
      console.log('LOGIN SUCCESS', response);

      this.router.navigate(['/home']);


    } catch (error: any) {

      this.isLoading = false;

      const message = error?.error?.message;

      this.passwordError = message;

      this.cd.detectChanges();

      return;

    } finally {

      this.isLoading = false;
    }
  }
}