import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Friend } from './friend';

describe('Friend', () => {
  let component: Friend;
  let fixture: ComponentFixture<Friend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Friend],
    }).compileComponents();

    fixture = TestBed.createComponent(Friend);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
