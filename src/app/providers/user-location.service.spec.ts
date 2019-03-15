import { TestBed } from '@angular/core/testing';

import { UserLocationService } from './user-location.service';

describe('UserLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLocationService = TestBed.get(UserLocationService);
    expect(service).toBeTruthy();
  });
});
