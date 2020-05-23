import { TestBed } from '@angular/core/testing';

import { IpfsMetadataService } from './ipfs-metadata.service';

describe('IpfsMetadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IpfsMetadataService = TestBed.get(IpfsMetadataService);
    expect(service).toBeTruthy();
  });
});
