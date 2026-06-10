import { TestBed } from '@angular/core/testing';

import { VerifyGuard } from './verify.guard';

describe('VerifyGuard', () => {
  let service: VerifyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
