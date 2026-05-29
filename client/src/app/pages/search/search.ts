import { Component } from '@angular/core';
import { Searchbar } from '../../component/searchbar/searchbar';
import { Reveal } from '../../directive/reveal';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [Searchbar, Reveal, CommonModule],
  standalone: true,
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

  resultSuccess: boolean = false;
  searchResults: any[] = [];
  isLoading: boolean = false;
  searchError: string = '';
  noResult: boolean = false;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const searchTerm = params['name'];
      if (searchTerm) {
        this.performSearch(searchTerm);
      }
    });
  }

  async onSearch(searchTerm: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { name: searchTerm },
      queryParamsHandling: 'merge'
    });

    this.performSearch(searchTerm);
  }

  async performSearch(searchTerm: string) {
    this.isLoading = true;
    this.resultSuccess = false;
    this.noResult = false;
    this.searchResults = [];
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
        this.searchResults = response.users;
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

  viewUserDetail(userId: number) {
    this.cd.detectChanges();
    this.router.navigate(['/user', userId]);
  }
}