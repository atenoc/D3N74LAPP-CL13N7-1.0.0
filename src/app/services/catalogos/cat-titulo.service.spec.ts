import { TestBed } from '@angular/core/testing';

import { CatTituloService } from './cat-titulo.service';

describe('CatTituloService', () => {
  let service: CatTituloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatTituloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
