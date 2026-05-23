import { Component } from '@angular/core';
import { Globe } from '../../component/globe/globe';
import { Reveal } from '../../directive/reveal';
import { Button } from '../../component/button/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Globe, Reveal, Button, RouterLink],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { }
