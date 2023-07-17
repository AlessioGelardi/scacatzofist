import { TestBed } from '@angular/core/testing';

import { StateTradeService } from './state-trade.service';

describe('StateTradeService', () => {
  let service: StateTradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateTradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
