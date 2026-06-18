import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    identityNumber: string;
    country: string;
    email: string;
    phoneNumber: string;
    address: string;
    sex: string;
    status: string;
    verify: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private tokenExpirationTimer: any = null;
  private tokenExpirationWarningTimer: any = null;

  private apiUrl = API_CONFIG.usersEndpointBase;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private freshLoginSubject = new BehaviorSubject<boolean>(false);
  public freshLogin$ = this.freshLoginSubject.asObservable();
  private expireTokenSubject = new BehaviorSubject<boolean>(false);
  public expireToken$ = this.expireTokenSubject.asObservable();

  private readonly EXPIRATION_TIME = 60 * 60 * 1000;
  private readonly WARNING_TIME = (60 * 60 * 1000) - (30 * 1000);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  login(form: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, form);
  }

  register(form: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, form);
  }

  setToken(token: string, user: any) {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenCreatedAt', Date.now().toString());
    localStorage.setItem('user', JSON.stringify(user));

    this.currentUserSubject.next(user);
    this.freshLoginSubject.next(true);
    this.startTokenExpirationTimer();
  }

  private isTokenExpired(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const tokenCreatedAt = localStorage.getItem('tokenCreatedAt');
    if (!tokenCreatedAt) return false;
    const createdTime = parseInt(tokenCreatedAt);
    const currentTime = Date.now();
    const elapsedTime = currentTime - createdTime;
    return elapsedTime > this.EXPIRATION_TIME;
  }

  private getTokenRemainingTime(): number {
    if (!isPlatformBrowser(this.platformId)) return 0;

    const tokenCreatedAt = localStorage.getItem('tokenCreatedAt');
    if (!tokenCreatedAt) return 0;

    const createdTime = parseInt(tokenCreatedAt);
    const currentTime = Date.now();
    const elapsedTime = currentTime - createdTime;
    const remainingTime = this.EXPIRATION_TIME - elapsedTime;
    return remainingTime > 0 ? remainingTime : 0;
  }

  resetTokenTimer() {
    console.log('Token timer reset due to user activity');
    this.startTokenExpirationTimer();
  }

  public startTokenExpirationTimer() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    if (this.tokenExpirationWarningTimer) {
      clearTimeout(this.tokenExpirationWarningTimer);
    }
    this.tokenExpirationWarningTimer = setTimeout(() => {
      console.warn("Token will expire in 30 seconds");
    }, this.WARNING_TIME);

    this.tokenExpirationTimer = setTimeout(() => {
      console.log("Token expired. Logging out...");
      this.expireTokenSubject.next(true);
      this.logout();
      this.router.navigate(['/login']);
    }, this.EXPIRATION_TIME);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    if (this.isTokenExpired()) {
      console.warn("Token expired. Logging out...");
      this.expireTokenSubject.next(true);
      this.logout();
      return null;
    }

    return localStorage.getItem('authToken');
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    if (this.isTokenExpired()) {
      console.warn("Token expired. Logging out...");
      this.expireTokenSubject.next(true);
      this.logout();
      return false;
    }

    return true;
  }

  loadUserFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (token && this.isTokenExpired()) {
      console.warn("Token expired. Clearing data...");
      this.expireTokenSubject.next(true);
      this.logout();
      return;
    }
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
      const remainingTime = this.getTokenRemainingTime();
      if (remainingTime > 0) {
        this.startTokenExpirationTimerWithDelay(remainingTime);
      } else {
        this.expireTokenSubject.next(true);
        this.logout();
      }
    }
  }

  private startTokenExpirationTimerWithDelay(delayMs: number) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    if (this.tokenExpirationWarningTimer) {
      clearTimeout(this.tokenExpirationWarningTimer);
    }
    const warningTime = Math.max(0, delayMs - 10 * 1000);
    if (warningTime > 0) {
      this.tokenExpirationWarningTimer = setTimeout(() => {
        console.warn("Token will expire in 30 seconds");
      }, warningTime);
    }
    this.tokenExpirationTimer = setTimeout(() => {
      console.log("Token expired. Logging out...");
      this.expireTokenSubject.next(true);
      this.logout();
      this.router.navigate(['/login']);
    }, delayMs);
  }

  clearFreshLogin() {
    this.freshLoginSubject.next(false);
  }

  logout() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    if (this.tokenExpirationWarningTimer) {
      clearTimeout(this.tokenExpirationWarningTimer);
    }
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenCreatedAt');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  updateCurrentUser(user: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
}