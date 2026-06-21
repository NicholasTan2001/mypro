import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslateModule],
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
      if (user) {
        this.isUser = true;
        this.isAdmin = user.admin === "Yes";
      } else {
        this.isUser = false;
        this.isAdmin = false;
      }
    });
  }

}
