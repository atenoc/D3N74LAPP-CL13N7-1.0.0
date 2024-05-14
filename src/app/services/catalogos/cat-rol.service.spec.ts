import { TestBed } from '@angular/core/testing';

import { CatRolService } from './cat-rol.service';

describe('CatRolService', () => {
  let service: CatRolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatRolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
