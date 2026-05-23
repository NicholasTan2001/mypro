import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.html'
})
export class InputComponent {

  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() inputmode: string = '';
  @Input() maxlength: string = '';

  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.model = value;
    this.modelChange.emit(value);
  }
}