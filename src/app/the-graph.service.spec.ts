import { TestBed } from '@angular/core/testing';

import { TheGraphService } from './the-graph.service';

describe('TheGraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheGraphService = TestBed.get(TheGraphService);
    expect(service).toBeTruthy();
  });
});
