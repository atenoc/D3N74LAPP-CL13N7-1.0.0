import { TestBed } from '@angular/core/testing';

import { CatEspecialidadService } from './cat-especialidad.service';

describe('CatEspecialidadService', () => {
  let service: CatEspecialidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatEspecialidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
