import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class LogoutService {

  private logoutSuccessSubject = new BehaviorSubject<boolean>(false);
  public logoutSuccess$ = this.logoutSuccessSubject.asObservable();

  showLogoutSuccess() {
    this.logoutSuccessSubject.next(true);
  }

  hideLogoutSuccess() {
    this.logoutSuccessSubject.next(false);
  }

}