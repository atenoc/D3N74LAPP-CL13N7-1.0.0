import { TestBed } from '@angular/core/testing';

import { HistoriaDentalService } from '../historias/historia-dental.service';

describe('HistoriaDentalService', () => {
  let service: HistoriaDentalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriaDentalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
