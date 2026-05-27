import { Component, OnInit } from '@angular/core';
import { Globe } from '../../component/globe/globe';
import { Reveal } from '../../directive/reveal';
import { Button } from '../../component/button/button';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [Globe, Reveal, Button, RouterLink],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements OnInit {

  malaysiaUsers: number = 0;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.fetchMalaysiaUserCount();
  }

  async fetchMalaysiaUserCount() {
    try {
      const response: any = await firstValueFrom(
        this.http.get('http://localhost:5284/api/users/malaysia')
      );
      this.malaysiaUsers = response.malaysiaUsers + 10000;
      this.cd.detectChanges();
    } catch (error) {
      console.error('Failed to fetch user count:', error);
    }
  }
}