import { TestBed } from '@angular/core/testing';

import { ActivityInterceptor } from './activity.interceptor';

describe('ActivityInterceptor', () => {
  let service: ActivityInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
