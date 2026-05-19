import { Reveal } from './reveal';
import { ElementRef } from '@angular/core';

describe('Reveal', () => {
  it('should create an instance', () => {
    const mockEl = { nativeElement: document.createElement('div') };
    const directive = new Reveal(new ElementRef(mockEl));
    expect(directive).toBeTruthy();
  });
});