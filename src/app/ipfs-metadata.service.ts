import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Metadata {
  [key: string]: Metadata;
}

@Injectable({
  providedIn: 'root'
})
export class IpfsMetadataService {

  private readonly IPFS_PREFIX: string = 'https://ipfs.infura.io/ipfs/';

  constructor(private http: HttpClient) { }

  handleError(error) {
    console.error(error);
  }

  getMetadata(ipfs: string): Observable<object> {
    let url = (ipfs.startsWith('http')) ? ipfs : this.IPFS_PREFIX.concat(ipfs);
    return this.http.get<object>(url);
  }
}