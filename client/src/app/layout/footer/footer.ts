import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})

export class Footer {

  isUser: boolean = false;
  isAdmin: boolean = false;


  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isUser = user;
      this.isAdmin = user.admin === "Yes";
    });
  }

}
