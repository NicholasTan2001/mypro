import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scrolltop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scrolltop.html',
  styleUrl: './scrolltop.css',
})
export class Scrolltop {

  isVisible = false;

  @HostListener('window:scroll')
  onScroll() {
    this.isVisible = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}