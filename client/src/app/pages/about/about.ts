import { Component } from '@angular/core';
import { Reveal } from '../../directive/reveal';

@Component({
  selector: 'app-about',
  imports: [Reveal],
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About { }
