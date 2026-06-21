import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Reveal } from '../../directive/reveal';
import { API_CONFIG } from '../../config/api.config';
import { firstValueFrom } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Searchbar } from '../../component/searchbar/searchbar';
import { CommonModule } from '@angular/common';
import { Button } from '../../component/button/button';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-admin',
  imports: [Searchbar, Reveal, CommonModule, Button, TranslateModule],
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {

  form = {
    Id: '',
    IdentityNumber: '',
    Name: '',
    Age: '',
    Country: '',
    Email: '',
    PhoneNumber: '',
    Sex: '',
    Address: '',
    BirthDate: '',
    BlueTick: '',
  }

  id: any = null;
  resultSuccess: boolean = false;
  allSearchResults: any[] = [];
  displayedResults: any[] = [];
  isLoading: boolean = false;
  searchError: string = '';
  noResult: boolean = false;
  shakingId: number | null = null;
  canShake: boolean = false;
  isLoading2: boolean = false;
  isLoading3: boolean = false;
  isLoading4: boolean = false;
  isLoading5: boolean = false;
  isLoading6: boolean = false;
  isLoading7: boolean = false;
  isLoading8: boolean = false;
  isLoadingMore: boolean = false;
  permissionSuccess: boolean = false;
  showExistFriendRequest: boolean = false;
  sentRequests: number[] = [];
  friends: number[] = [];
  addAdminSuccess: boolean = false;
  searchName: string = '';
  admins: any[] = [];
  blocks: any[] = [];
  blueTicks: any[] = [];
  deleteAdminSuccess: boolean = false;
  blockUserSuccess: boolean = false;
  unblockUserSuccess: boolean = false;
  rejectBlueTickSuccess: boolean = false;
  removeBlueTickSuccess: boolean = false
  acceptBlueTickSuccess: boolean = false;
  deleteUserSuccess: boolean = false;
  resultsPerPage: number = 5;
  currentPage: number = 1;
  showMoreButton: boolean = false;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private router: Router, private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.id = user.id;
      this.loadRelationship();
    }
    this.route.queryParams.subscribe(params => {
      const searchTerm = params['name'];
      if (searchTerm) {
        this.performSearch(searchTerm);
      }
    });
    this.loadUser();
    this.loadAdmin();
    this.loadBlock();
    this.loadBlueTick();
  };

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
          this.form.Id = response.id;
          this.form.IdentityNumber = response.identityNumber;
          this.form.Name = response.name;
          this.form.Age = (response.age).toString();
          this.form.Country = response.country;
          this.form.Email = response.email;
          this.form.BlueTick = response.blueTick;
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load user information:', error);
      this.cd.detectChanges();
    }
  }

  async loadRelationship() {
    try {
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.usersEndpointBase}/relationship/${this.id}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response && response.relationships) {
        response.relationships.forEach((relationship: any) => {
          this.sentRequests.push(parseInt(relationship.permission));
        });

        response.relationships.forEach((relationship: any) => {
          this.friends.push(parseInt(relationship.friend));
        });
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load relationships:', error);
      this.sentRequests = [];
      this.cd.detectChanges();
    }
  }

  isRequestSent(permissionId: number): boolean {
    return this.sentRequests.includes(permissionId);
  }

  isFriend(friendId: number): boolean {
    return this.friends.includes(friendId);
  }

  async loadAdmin() {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.usersEndpointBase}/admin`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response && response.admins) {
        this.admins = response.admins;
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load friend requests:', error);
      this.admins = [];
      this.cd.detectChanges();
    }
  }

  async loadBlock() {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.usersEndpointBase}/block`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response && response.blocks) {
        this.blocks = response.blocks;
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load block requests:', error);
      this.blocks = [];
      this.cd.detectChanges();
    }
  }

  async loadBlueTick() {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.usersEndpointBase}/bluetick`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response && response.blueTicks) {
        this.blueTicks = response.blueTicks;
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load block requests:', error);
      this.blueTicks = [];
      this.cd.detectChanges();
    }
  }

  updateDisplayedResults() {
    const startIndex = 0;
    const endIndex = this.currentPage * this.resultsPerPage;
    this.displayedResults = this.allSearchResults.slice(startIndex, endIndex);

    this.showMoreButton = endIndex < this.allSearchResults.length;

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

  async onSearch(searchTerm: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { name: searchTerm },
      queryParamsHandling: 'merge'
    });
    this.searchName = searchTerm;
    this.resetPagination();
    this.performSearch(searchTerm);
  }

  async performSearch(searchTerm: string) {
    this.isLoading = true;
    this.resultSuccess = false;
    this.allSearchResults = [];
    this.displayedResults = [];
    this.noResult = false;
    this.searchError = '';
    if (!searchTerm.trim()) {
      this.searchError = "Valid name is required.";
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    try {
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.usersEndpointBase}/search?name=${encodeURIComponent(searchTerm)}`
        )
      );
      if (response.users && response.users.length > 0) {
        this.allSearchResults = response.users;
        this.updateDisplayedResults();
        this.resultSuccess = true;
      } else {
        this.noResult = true;
        this.resultSuccess = false;
      }
      this.cd.detectChanges();
    } catch (error: any) {
      this.noResult = true;
      this.resultSuccess = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  async removeBlueTick(result: any) {
    this.isLoading3 = true;
    try {
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/reject-bluetick`,
          {
            adminId: this.id,
            id: result.id,
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
        this.loadBlueTick();
        this.onSearch(this.searchName);
        this.removeBlueTickSuccess = true;
        this.isLoading3 = false;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to remove bluetick:', error);
      this.isLoading3 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading3 = false;
      this.cd.detectChanges();
    }
  }

  viewUserDetail(userId: number) {
    this.cd.detectChanges();
    this.router.navigate(['/user', userId]);
  }

  async addAdmin(request: any) {
    try {
      this.isLoading2 = true;
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.isLoading2 = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/add-admin`,
          {
            adminId: this.id,
            id: request.id,
            admin: request.admin
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
        this.addAdminSuccess = true;
        this.isLoading2 = false;
        this.onSearch(this.searchName);
        this.loadAdmin();
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to accept friend request:', error);
      this.isLoading2 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading2 = false;
      this.cd.detectChanges();
    }
  }

  closeAddAdminSuccessModal() {
    this.addAdminSuccess = false;
  }

  async deleteAdmin(id: number) {
    this.isLoading4 = true;
    try {
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/delete-admin`,
          {
            adminId: this.id,
            id: id,
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
        this.loadAdmin();
        this.onSearch(this.searchName);
        this.deleteAdminSuccess = true;
        this.isLoading4 = false;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete admin:', error);
      this.isLoading4 = false;
      this.cd.detectChanges();
    }
  }

  closeDeleteAdminModal() {
    this.deleteAdminSuccess = false;
  }

  async unblockUser(request: any) {
    this.isLoading5 = true;
    try {
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/unblock-user`,
          {
            adminId: this.id,
            id: request.id,
            block: request.block
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
        this.loadAdmin();
        this.onSearch(this.searchName);
        this.unblockUserSuccess = true;
        this.isLoading5 = false;
        this.loadBlock();
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete admin:', error);
      this.isLoading5 = false;
      this.cd.detectChanges();
    }
  }

  async blockUser(request: any) {
    this.isLoading5 = true;
    try {
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/block-user`,
          {
            adminId: this.id,
            id: request.id,
            block: request.block
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
        this.loadAdmin();
        this.onSearch(this.searchName);
        this.blockUserSuccess = true;
        this.isLoading5 = false;
        this.loadBlock();
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete admin:', error);
      this.isLoading5 = false;
      this.cd.detectChanges();
    }
  }

  closeBlockUserModal() {
    this.blockUserSuccess = false;
  }

  closeUnblockUserModal() {
    this.unblockUserSuccess = false;
  }

  async rejectBlueTick(request: any) {
    this.isLoading7 = true;
    try {
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/reject-bluetick`,
          {
            adminId: this.id,
            id: request.id,
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
        this.loadBlueTick();
        this.rejectBlueTickSuccess = true;
        this.isLoading7 = false;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete admin:', error);
      this.isLoading7 = false;
      this.cd.detectChanges();
    }
  }

  async acceptBlueTick(request: any) {
    this.isLoading8 = true;
    this.isLoading3 = true;
    try {
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/accept-bluetick`,
          {
            adminId: this.id,
            id: request.id,
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
        this.loadBlueTick();
        this.onSearch(this.searchName);
        this.acceptBlueTickSuccess = true;
        this.isLoading8 = false;
        this.isLoading3 = false;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete admin:', error);
      this.isLoading8 = false;
      this.isLoading3 = false;
      this.cd.detectChanges();
    }
  }

  closeRejectBlueTickModal() {
    this.rejectBlueTickSuccess = false;
  }

  closeAcceptBlueTickModal() {
    this.acceptBlueTickSuccess = false;
  }

  closeRemoveBlueTickModal() {
    this.removeBlueTickSuccess = false;
  }

  async removeAccount(result: any) {
    this.isLoading6 = true;
    try {
      const response = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/delete-account-admin`,
          {
            adminId: this.id,
            id: result.id,
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
        this.isLoading6 = false;
        this.deleteUserSuccess = true;
        this.onSearch(this.searchName);
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isLoading6 = false;
      console.error('Failed to delete user:', error);
      this.cd.detectChanges();
    } finally {
      this.isLoading6 = false;
      this.cd.detectChanges();
    }
  }

  closeRemoveUserModal() {
    this.deleteUserSuccess = false;
  }

}
