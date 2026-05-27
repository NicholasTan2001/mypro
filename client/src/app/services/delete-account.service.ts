import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DeleteAcccountService {

  private deleteAccountSuccessSubject = new BehaviorSubject<boolean>(false);
  public deleteAccountSuccess$ = this.deleteAccountSuccessSubject.asObservable();

  showDeleteAccountSuccess() {
    this.deleteAccountSuccessSubject.next(true);
  }

  hideDeleteAccountSuccess() {
    this.deleteAccountSuccessSubject.next(false);
  }

}