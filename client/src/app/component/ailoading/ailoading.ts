import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ailoading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ailoading.html',
  styleUrl: './ailoading.css',
})
export class Ailoading {
  @Input() visible: boolean = false;
}