import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../component/input/input';
import { RouterLink } from '@angular/router';
import { Button } from "../../component/button/button";
import { firstValueFrom } from "rxjs";
import { CommonModule } from "@angular/common";
import { Reveal } from "../../directive/reveal";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, InputComponent, RouterLink, Button, CommonModule, Reveal],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  form = {
    IdentityNumber: '',
    Name: '',
    Age: '',
    Password: '',
    ConfirmPassword: '',
    Country: 'Malaysia'
  };

  identityNumberError: string = '';
  nameError: string = '';
  ageError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';

  registerSuccess: boolean = false;

  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }
  async onSubmit() {

    this.isLoading = true;

    this.identityNumberError = '';
    this.nameError = '';
    this.ageError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';

    try {

      if (!this.form.IdentityNumber) {

        this.identityNumberError = 'Identity number is required.';
        return;

      }

      if (!/^\d{12}$/.test(this.form.IdentityNumber)) {

        this.identityNumberError = 'Valid indentity number is required.';
        return;

      }

      if (!this.form.Name) {

        this.nameError = 'Name is required.';
        return;

      }

      if (!this.form.Age) {

        this.ageError = 'Age is required.';
        return;

      }

      if (Number(this.form.Age) <= 0 || Number(this.form.Age) > 120 || isNaN(Number(this.form.Age))) {

        this.ageError = 'Valid age is required.';
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

      if (this.form.Password !== this.form.ConfirmPassword) {

        this.confirmPasswordError = 'Passwords do not match.';
        return;

      }

      const response = await firstValueFrom(
        this.http.post(
          'http://localhost:5284/api/users/register',
          this.form,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      );

      if (response) {

        this.isLoading = false;
        this.registerSuccess = true;
        this.cd.detectChanges();

        return;

      }

    } catch (error: any) {

      alert('Registration failed');
      this.isLoading = false;

    } finally {

      this.isLoading = false;

    }
  }

  loginPage() {

    this.router.navigate(['/login']);

  }


}