import { Component } from '@angular/core';
import { Button } from '../../component/button/button';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../directive/reveal';
import { InputComponent } from '../../component/input/input';

@Component({
  selector: 'app-login',
  imports: [Button, RouterLink, Reveal, InputComponent],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

}

