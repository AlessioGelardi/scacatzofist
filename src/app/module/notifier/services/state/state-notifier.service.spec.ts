import { TestBed } from '@angular/core/testing';

import { StateNotifierService } from './state-notifier.service';

describe('StateNotifierService', () => {
  let service: StateNotifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateNotifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
