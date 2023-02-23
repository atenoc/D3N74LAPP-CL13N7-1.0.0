import { TestBed } from '@angular/core/testing';

import { CentroService } from './centro.service';

describe('CentroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CentroService = TestBed.get(CentroService);
    expect(service).toBeTruthy();
  });
});
