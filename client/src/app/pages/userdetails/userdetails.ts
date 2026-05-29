import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Reveal } from '../../directive/reveal';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';

@Component({
  selector: 'app-userdetails',
  imports: [CommonModule, Reveal],
  standalone: true,
  templateUrl: './userdetails.html',
  styleUrl: './userdetails.css'
})
export class UserDetails implements OnInit {

  user: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserDetail(userId);
    }
  }

  async loadUserDetail(userId: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${API_CONFIG.usersEndpointBase}/${userId}`)
      );

      if (response) {
        this.user = {
          id: response.id,
          name: response.name,
          age: response.age,
          email: response.email,
          phoneNumber: response.phoneNumber,
          country: response.country,
        };
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.cd.detectChanges();

    } finally {
      this.cd.detectChanges();
    }
  }

}