import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[reveal]',
  standalone: true,
})
export class Reveal implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.el.nativeElement.classList.add('reveal-hidden');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add('reveal-visible');
            this.observer.unobserve(this.el.nativeElement);
          }
        });
      },
      { threshold: 0.2 }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

