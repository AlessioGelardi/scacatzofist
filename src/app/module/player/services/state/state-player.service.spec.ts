import { TestBed } from '@angular/core/testing';

import { StatePlayerService } from './state-player.service';

describe('StatePlayerService', () => {
  let service: StatePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatePlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
