import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aibutton } from './aibutton';

describe('Aibutton', () => {
  let component: Aibutton;
  let fixture: ComponentFixture<Aibutton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aibutton],
    }).compileComponents();

    fixture = TestBed.createComponent(Aibutton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
