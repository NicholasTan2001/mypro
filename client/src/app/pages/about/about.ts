import { Component } from '@angular/core';
import { Reveal } from '../../directive/reveal';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-about',
  imports: [Reveal, TranslateModule],
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css',
})

export class About { }
