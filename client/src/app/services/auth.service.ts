import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    identityNumber: string;
    country: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5284/api/users';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private freshLoginSubject = new BehaviorSubject<boolean>(false);
  public freshLogin$ = this.freshLoginSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  login(form: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, form);
  }

  register(form: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, form);
  }

  setToken(token: string, user: any) {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.freshLoginSubject.next(true);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    return localStorage.getItem('authToken');
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    return !!localStorage.getItem('authToken');
  }

  loadUserFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  clearFreshLogin() {
    this.freshLoginSubject.next(false);
  }

  logout() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}