import { TestBed } from '@angular/core/testing';

import { StateDatabaseService } from './state-database.service';

describe('StateDatabaseService', () => {
  let service: StateDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
