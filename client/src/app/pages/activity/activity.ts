import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Reveal } from '../../directive/reveal';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { CommonModule, DatePipe } from '@angular/common';
import { Button } from '../../component/button/button';
import { InputComponent } from '../../component/input/input';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-activity',
  imports: [Reveal, DatePipe, CommonModule, Button, InputComponent, FormsModule, TranslateModule],
  standalone: true,
  templateUrl: './activity.html',
  styleUrl: './activity.css',
})
export class Activity implements OnInit {

  form = {
    name: '',
    identityNumber: '',
  }

  form2 = {
    password: '',
  }

  activities: any[] = [];
  displayedResults: any[] = [];
  isLoadingMore: boolean = false;
  isLoading: boolean = false;
  resultsPerPage: number = 10;
  currentPage: number = 1;
  showMoreButton: boolean = false;
  passwordError: string = '';
  deleteHistoryModal: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient, private cd: ChangeDetectorRef, private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadUser();
    this.loadHistory();
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
          this.form.name = response.name;
          this.form.identityNumber = response.identityNumber;
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load user information:', error);
      this.cd.detectChanges();
    }
  }

  async loadHistory() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/history/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`
              }
            }
          )
        );
        if (response && response.activities) {
          this.activities = response.activities.map((a: any) => ({
            id: a.id,
            history: a.history,
            createdAt: new Date(
              new Date(a.createdAt).getTime() + (8 * 60 * 60 * 1000)),
          }));
          this.updateDisplayedResults();
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load achievements:', error);
      this.cd.detectChanges();
    }
  }

  updateDisplayedResults() {
    const startIndex = 0;
    const endIndex = this.currentPage * this.resultsPerPage;
    this.displayedResults = this.activities.slice(startIndex, endIndex);
    this.showMoreButton = endIndex < this.activities.length;
    this.cd.detectChanges();
  }

  showMoreResults() {
    this.isLoadingMore = true;
    this.currentPage++;

    setTimeout(() => {
      this.updateDisplayedResults();
      this.isLoadingMore = false;
      this.cd.detectChanges();
    }, 300);
  }

  resetPagination() {
    this.currentPage = 1;
    this.displayedResults = [];
    this.showMoreButton = false;
  }

  async onSubmit() {
    this.isLoading = true;
    this.passwordError = "";
    try {
      if (!this.form2.password) {
        this.passwordError = this.translate.instant('activity.errorpassword1');
        this.isLoading = false;
        return;
      }
      if (this.form2.password.length < 8) {
        this.passwordError = this.translate.instant('activity.errorpassword2');
        this.isLoading = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/delete-history`,
          {
            identityNumber: this.form.identityNumber,
            password: this.form2.password
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
        this.isLoading = false;
        this.loadHistory();
        this.deleteHistoryModal = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isLoading = false;
      const message = error?.error?.message || 'Failed to delete account. Please try again.';
      if (message == "Invalid password.")
        this.passwordError = this.translate.instant('activity.errorpassword3');
      this.cd.detectChanges();
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }

  }

  deleteHistory() {
    this.deleteHistoryModal = false;
  }

  checkStartsWith(str: string, searchStr: string): boolean {
    return str?.startsWith(searchStr) ?? false;
  }

  checkEndsWith(str: string, searchStr: string): boolean {
    return str?.endsWith(searchStr) ?? false;
  }

  extractName(history: string, prefix: string): string {
    return history
      .replace(prefix, '')
      .replace('.', '')
      .trim();
  }
}
