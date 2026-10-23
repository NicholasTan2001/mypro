import { Component, OnInit } from '@angular/core';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { AuthService } from './services/auth.service'
import { RouterOutlet } from '@angular/router';
import { Scrolltop } from './component/scrolltop/scrolltop';
import { ChangeDetectorRef } from '@angular/core';
import { Button } from './component/button/button';
import { Chatbox } from './component/chatbox/chatbox';
import { Ailoading } from './component/ailoading/ailoading';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Scrolltop, Button, Chatbox, Ailoading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  isAiLoading: boolean = false;
  expireTokenModal: boolean = false;

  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    try {

      this.authService.loadUserFromStorage();

      this.authService.expireToken$.subscribe(success => {
        this.expireTokenModal = success;
      });

      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Error initializing app:', error);
    }
  }

  closeExpireTokenModal() {
    this.expireTokenModal = false;
  }

  showAiLoading(): void {
    this.isAiLoading = true;

    setTimeout(() => {
      this.isAiLoading = false;

      this.cd.detectChanges();
    }, 5000);
  }
}
