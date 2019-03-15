import { TestBed } from '@angular/core/testing';

import { ParamExpService } from './param-exp.service';

describe('ParamExpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParamExpService = TestBed.get(ParamExpService);
    expect(service).toBeTruthy();
  });
});
