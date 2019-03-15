import { TestBed } from '@angular/core/testing';

import { NatuClientService } from './natu-client.service';

describe('NatuClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NatuClientService = TestBed.get(NatuClientService);
    expect(service).toBeTruthy();
  });
});
