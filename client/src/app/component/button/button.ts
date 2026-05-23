import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
})
export class Button {
  @Input() label: string = 'Button';
  @Input() variant: 'primary' | 'outline' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() onClick = new EventEmitter<MouseEvent>();

  get classes(): string {
    const base = 'font-medium rounded-lg transition duration-300 shadow-md cursor-pointer';

    const variants = {
      primary: 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-purple-500/50',
      outline: 'border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
      danger: 'bg-red-600 hover:bg-red-500 text-white hover:shadow-red-500/50',
    };

    const sizes = {
      sm: 'text-sm px-3 py-1',
      md: 'md:text-base text-sm md:px- md:py-2 px-3 py-2',
      lg: 'text-lg px-6 py-2',
    };

    return `${base} ${variants[this.variant]} ${sizes[this.size]}`;
  }
}
