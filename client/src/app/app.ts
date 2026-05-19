import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  message = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getMessage().subscribe({
      next: (data) => {
        this.message = data.message;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}