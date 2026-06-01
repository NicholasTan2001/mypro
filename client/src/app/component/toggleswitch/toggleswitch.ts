import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  templateUrl: './toggleswitch.html',
  styleUrl: './toggleswitch.css',
})

export class Toggleswitch {
  @Input() isActive: boolean = false;
  @Output() toggled = new EventEmitter<boolean>();

  toggle() {
    this.isActive = !this.isActive;
    this.toggled.emit(this.isActive);
  }
}