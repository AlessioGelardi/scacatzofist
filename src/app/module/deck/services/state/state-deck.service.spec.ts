import { TestBed } from '@angular/core/testing';

import { StateDeckService } from './state-deck.service';

describe('StateDeckService', () => {
  let service: StateDeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateDeckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
