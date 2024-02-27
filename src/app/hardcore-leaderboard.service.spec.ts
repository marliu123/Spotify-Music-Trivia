import { TestBed } from '@angular/core/testing';

import { HardcoreLeaderboardService } from './hardcore-leaderboard.service';

describe('HardcoreLeaderboardService', () => {
  let service: HardcoreLeaderboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HardcoreLeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
