import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Marketplace, MarketplaceFactory } from './marketplace';

export interface TheGraphData {
  [key: string]: TheGraphData;
}

@Injectable({
  providedIn: 'root'
})
export class TheGraphService {

  constructor(private http: HttpClient) { }

  handleError(error) {
    console.error(error);
  }

  getArtistData(marketplace: Marketplace, address: string): Observable<object> {
    return this.http.post<object>(MarketplaceFactory.getTheGraphUrl(marketplace),
        {
          query: `{account(id: \"${address}\") {id totalPrimaryIncome totalRoyalty createdArtworks (orderBy: timeLastTransferred, orderDirection: desc) {id uri lastTransferPrice}}}`
        }
      ).pipe(
          map(data => {
            return {artist: data,
                    marketplace: marketplace};
          })
        );
  }
}