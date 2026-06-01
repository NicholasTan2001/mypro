import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggleswitch } from './toggleswitch';

describe('Toggleswitch', () => {
  let component: Toggleswitch;
  let fixture: ComponentFixture<Toggleswitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toggleswitch],
    }).compileComponents();

    fixture = TestBed.createComponent(Toggleswitch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
