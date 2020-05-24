import { TestBed } from '@angular/core/testing';

import { ArtdefiService } from './artdefi.service';

describe('ArtdefiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArtdefiService = TestBed.get(ArtdefiService);
    expect(service).toBeTruthy();
  });
});
