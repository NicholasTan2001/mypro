import { Directive, ElementRef, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[reveal]',
  standalone: true,
})

export class Reveal implements OnInit, OnDestroy {

  private observer!: IntersectionObserver;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.el.nativeElement;
    el.classList.add('reveal-hidden');
    requestAnimationFrame(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              el.classList.add('reveal-visible');
              this.observer.unobserve(el);
            }
          });
        },
        { threshold: 0.2 }
      );
      this.observer.observe(el);
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

}