import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from '../../component/button/button';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LogoutService } from '../../services/logout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Button, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {

  isUser: boolean = false;
  menuOpen = false;

  constructor(private authService: AuthService, private logoutService: LogoutService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isUser = user;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.logoutService.showLogoutSuccess();
    this.authService.logout();
  }

}