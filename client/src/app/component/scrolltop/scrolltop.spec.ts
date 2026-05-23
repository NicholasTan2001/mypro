import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scrolltop } from './scrolltop';

describe('Scrolltop', () => {
  let component: Scrolltop;
  let fixture: ComponentFixture<Scrolltop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scrolltop],
    }).compileComponents();

    fixture = TestBed.createComponent(Scrolltop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
