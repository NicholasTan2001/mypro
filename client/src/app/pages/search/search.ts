import { Component } from '@angular/core';
import { Searchbar } from '../../component/searchbar/searchbar';
import { Reveal } from '../../directive/reveal';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';
import { Router, ActivatedRoute } from '@angular/router';
import { Button } from '../../component/button/button';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  imports: [Searchbar, Reveal, CommonModule, Button, TranslateModule],
  standalone: true,
  templateUrl: './search.html',
  styleUrl: './search.css',
})

export class Search {
  id: string = "";
  resultSuccess: boolean = false;
  isLoading: boolean = false;
  searchError: string = '';
  noResult: boolean = false;
  shakingId: number | null = null;
  canShake: boolean = false;
  isLoading2: boolean = false;
  isLoading3: boolean = false;
  permissionSuccess: boolean = false;
  showExistFriendRequest: boolean = false;
  sentRequests: number[] = [];
  friends: number[] = [];
  allSearchResults: any[] = [];
  displayedResults: any[] = [];
  isLoadingMore: boolean = false;
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
    this.resetPagination();
    this.performSearch(searchTerm);
  }

  async performSearch(searchTerm: string) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.id = user.id;
    }
    this.isLoading = true;
    this.resultSuccess = false;
    this.noResult = false;
    this.allSearchResults = [];
    this.displayedResults = [];
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

  onCardClick(result: any) {
    this.isLoading3 = true;
    if (this.isFriend(result.id) || result.id == this.id) {
      this.viewUserDetail(result.id);
    }
    if (result.status === 'Private') {
      this.shakingId = null;
      this.canShake = false;
      this.cd.detectChanges();
      setTimeout(() => {
        this.shakingId = result.id;
        this.canShake = true;
        this.cd.detectChanges();
      }, 0);
      setTimeout(() => {
        this.shakingId = null;
        this.canShake = false;
        this.cd.detectChanges();
      }, 600);
    } else {
      this.viewUserDetail(result.id);
    }
    this.isLoading3 = false;
  }

  viewUserDetail(userId: number) {
    this.cd.detectChanges();
    this.router.navigate(['/user', userId]);
  }

  async onPermissionClick(result: any) {
    this.isLoading2 = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.isLoading2 = false;
        return;
      }
      const response: any = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/add-permission`,
          {
            identityNumber: user.identityNumber,
            permission: result.id,
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
        this.permissionSuccess = true;
        this.isLoading2 = false;
        this.loadRelationship();
        this.cd.detectChanges();
      }
    } catch (error: any) {
      if (error.error?.message == "You already received a request from this user.") {
        this.showExistFriendRequest = true;
      }
      this.isLoading2 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading2 = false;
      this.cd.detectChanges();
    }
  }

  closePermissionSuccessModal() {
    this.permissionSuccess = false;
  }

  closeExistFriendRequestModal() {
    this.showExistFriendRequest = false;
  }




}