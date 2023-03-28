import { TestBed } from '@angular/core/testing';

import { StateMarketService } from './state-market.service';

describe('StateMarketService', () => {
  let service: StateMarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateMarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
