import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule, Mic, Pause } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './button.html',
})

export class Button {

  @Input() label: string = 'Button';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'outline' | 'danger' | 'light-primary' | 'light-danger' | 'heavy-danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() href?: string;
  @Input() icon?: string;
  @Input() iconOnly: boolean = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  readonly icons = { Mic, Pause };

  get classes(): string {
    const base = 'font-medium rounded-lg transition duration-300 shadow-md cursor-pointer';
    const variants = {
      primary: 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-purple-500/50',
      outline: 'border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
      danger: 'bg-red-600 hover:bg-red-500 text-white hover:shadow-red-500/50',
      'light-primary': 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-300/50',
      'light-danger': 'bg-red-400 hover:bg-red-300 text-white hover:shadow-red-500/50',
      'heavy-danger': 'bg-red-700 hover:bg-red-600 text-white hover:shadow-red-600/50'

    };

    const sizes = {
      sm: 'md:text-base text-sm px-2 py-1',
      md: 'md:text-base text-sm md:px-3 md:py-2 px-3 py-2',
      lg: 'text-lg px-6 py-2',
    };
    return `${base} ${variants[this.variant]} ${sizes[this.size]}`;
  }

}
