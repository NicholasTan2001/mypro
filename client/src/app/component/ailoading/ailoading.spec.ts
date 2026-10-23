import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ailoading } from './ailoading';

describe('Ailoading', () => {
  let component: Ailoading;
  let fixture: ComponentFixture<Ailoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ailoading],
    }).compileComponents();

    fixture = TestBed.createComponent(Ailoading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
