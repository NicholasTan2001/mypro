import { Component } from '@angular/core';
import { GlobeComponent } from '../../component/globe/globe';
import { Reveal } from '../../directive/reveal';

@Component({
  selector: 'app-home',
  imports: [GlobeComponent, Reveal],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { }
