import { Component, OnInit } from '@angular/core';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { AuthService } from './services/auth.service'
import { RouterOutlet } from '@angular/router';
import { Scrolltop } from './component/scrolltop/scrolltop';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Scrolltop],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.loadUserFromStorage();
  }

}