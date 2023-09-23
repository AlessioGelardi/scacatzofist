import { TestBed } from '@angular/core/testing';

import { FilterZainoService } from './filter-zaino.service';

describe('FilterZainoService', () => {
  let service: FilterZainoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterZainoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
