import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  async canActivate(
  ): Promise<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return true;
    }
    try {
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

      if (response.admin == "Yes") {
        return true;
      } else {
        this.router.navigate(['/myprofile']);
        return false;
      }
    } catch (error: any) {
      console.log('No verification record found');
      return false;
    }
  }
}