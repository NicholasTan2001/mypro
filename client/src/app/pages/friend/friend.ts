import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { Reveal } from '../../directive/reveal';
import { Button } from '../../component/button/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-friend',
  imports: [Reveal, Button, CommonModule, RouterLink, TranslateModule],
  standalone: true,
  templateUrl: './friend.html',
  styleUrl: './friend.css',
})

export class Friend implements OnInit {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUser();
    this.loadFriendRequests();
    this.loadFriend();
  };

  name: string = '';
  id: string = '';
  isLoading = false;
  isLoading2 = false;
  isLoading3 = false;
  acceptSuccess = false;
  deleteFriendRequestSuccess = false;
  deleteFriendSuccess = false;

  friendRequests: any[] = [];
  friends: any[] = [];

  form = {
    IdentityNumber: '',
    Name: '',
    Age: '',
    Country: '',
    Email: '',
    PhoneNumber: '',
    Sex: '',
    Address: '',
    BirthDate: ''
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
          this.name = response.name;
          this.form.IdentityNumber = response.identityNumber;
          this.form.Name = response.name;
          this.form.Age = (response.age).toString();
          this.form.Country = response.country;
          this.form.Email = response.email;
          this.form.PhoneNumber = response.phoneNumber;
          this.form.Address = response.address;
          this.form.Sex = response.sex;
          this.form.BirthDate = response.birthDate ? response.birthDate.split('T')[0]
            : '';

          this.id = user.id;
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load user information:', error);
      this.cd.detectChanges();
    }
  }

  async loadFriendRequests() {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.usersEndpointBase}/friend-request/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response && response.friendRequests) {
        this.friendRequests = response.friendRequests;
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load friend requests:', error);
      this.friendRequests = [];
      this.cd.detectChanges();
    }
  }

  async loadFriend() {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.usersEndpointBase}/friend/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response && response.friends) {
        this.friends = response.friends;
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load friend requests:', error);
      this.friends = [];
      this.cd.detectChanges();
    }
  }

  async acceptFriendRequest(requestId: any) {
    try {
      this.isLoading = true;
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.isLoading = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/accept-friend-request`,
          {
            identityNumber: user.identityNumber,
            requestId: requestId
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
        this.acceptSuccess = true;
        this.loadFriendRequests();
        this.loadFriend();
        this.isLoading = false;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to accept friend request:', error);
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  closeAcceptModal() {
    this.acceptSuccess = false;
  }

  async deleteFriendRequest(id: number) {
    this.isLoading2 = true;
    try {
      const response = await firstValueFrom(
        this.http.delete(
          `${API_CONFIG.usersEndpointBase}/delete-friend-request/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response) {
        this.loadFriendRequests();
        this.deleteFriendRequestSuccess = true;
        this.isLoading2 = false;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      this.isLoading2 = false;
      this.cd.detectChanges();

    }
  }

  closeDeleteFriendRequestSuccessModal() {
    this.deleteFriendRequestSuccess = false;
  }

  async deleteFriend(id: number) {
    this.isLoading3 = true;
    try {
      const response = await firstValueFrom(
        this.http.delete(
          `${API_CONFIG.usersEndpointBase}/delete-friend/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response) {
        this.loadFriend();
        this.deleteFriendSuccess = true;
        this.isLoading3 = false;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      this.isLoading3 = false;
      this.cd.detectChanges();
    }
  }

  closeDeleteFriendSuccessModal() {
    this.deleteFriendSuccess = false;
  }
}
