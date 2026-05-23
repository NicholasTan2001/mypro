import { Component } from '@angular/core';
import { Reveal } from '../../directive/reveal';
import { InputComponent } from '../../component/input/input';
import { RouterLink } from '@angular/router';
import { Button } from '../../component/button/button';


@Component({
  selector: 'app-register',
  imports: [Reveal, InputComponent, RouterLink, Button],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register { }
