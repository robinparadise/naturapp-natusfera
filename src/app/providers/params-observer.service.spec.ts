import { TestBed } from '@angular/core/testing';

import { ParamsObserverService } from './params-observer.service';

describe('ParamsObserverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParamsObserverService = TestBed.get(ParamsObserverService);
    expect(service).toBeTruthy();
  });
});
