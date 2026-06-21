import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from '../../component/button/button';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LogoutService } from '../../services/logout.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Button, CommonModule, TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {

  isUser: boolean = false;
  isAdmin: boolean = false;
  menuOpen = false;
  languageMenuOpen = false;

  constructor(private authService: AuthService, private logoutService: LogoutService,
    public languageService: LanguageService
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isUser = user;
      if (user) {
        this.isUser = true;
        this.isAdmin = user.admin === "Yes";
      } else {
        this.isUser = false;
        this.isAdmin = false;
      }

    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleLanguageMenu() {
    this.languageMenuOpen = !this.languageMenuOpen;
  }

  logout() {
    this.logoutService.showLogoutSuccess();
    this.authService.logout();
  }

  selectLanguage(language: SupportedLanguage) {
    this.languageService.useLanguage(language);
    this.languageMenuOpen = false;
  }

}
