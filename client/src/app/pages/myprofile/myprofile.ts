import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Button } from '../../component/button/button';
import { Reveal } from '../../directive/reveal';

@Component({
  selector: 'app-myprofile',
  imports: [CommonModule, Button, Reveal],
  standalone: true,
  templateUrl: './myprofile.html',
  styleUrl: './myprofile.css',
})
export class Myprofile implements OnInit {

  name: string = '';

  loginSuccess: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {

      this.name = user.name;

    }

    this.authService.freshLogin$.subscribe(isFreshLogin => {
      this.loginSuccess = isFreshLogin;
    });
  }

  closeModal() {

    this.loginSuccess = false;
    this.authService.clearFreshLogin();

  }

}