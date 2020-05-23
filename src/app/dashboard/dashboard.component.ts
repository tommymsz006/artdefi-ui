import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { TheGraphService, TheGraphData } from '../the-graph.service';
import { IpfsMetadataService } from '../ipfs-metadata.service';

import * as Jazzicon from 'jazzicon';

import { Artist } from '../artist';
import { Artwork, SuperRareArtwork } from '../artwork';
import { Marketplace, MarketplaceFactory } from '../marketplace';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  artist: Artist;
  artistIcon: SafeHtml;
  artworks: Artwork[][];

  private readonly ACCOUNT = '0xd656f8d9cb8fa5aeb8b1576161d0488ee2c9c926';
  //private readonly ACCOUNT: string = '0x21316e6a4f0af45e5f1503984e83b10c53b177d8';
  //private readonly ACCOUNT: string = '0xbd9b7373aac15d9a93c810df3999343f4fe1ed88';

  constructor(
    private theGraphService: TheGraphService,
    private ipfsMetadataService: IpfsMetadataService,
    private domSanitizer: DomSanitizer
  ) {
    this.artworks = [];
    for (let marketplace in Marketplace) {
      if (!isNaN(Number(marketplace))) {
        this.artworks[Number(marketplace)] = [];
      }
    }
  }

  getMarketplace(marketplace: Marketplace): string {
    return Marketplace[marketplace];
  }

  private readonly _cbArtistData = data => {
      console.log(data);
      let account = data.artist.data.account;
      if (this.artist == undefined) {
        this.artist = new Artist(account.id, 
                                  account.totalPrimaryIncome,
                                  account.totalRoyalty);
        this.artistIcon = this.domSanitizer.bypassSecurityTrustHtml(Jazzicon(40, parseInt(this.artist.id.slice(2, 10), 16)).outerHTML);
      } else {
        this.artist.addPrimaryIncome(account.totalPrimaryIncome);
        this.artist.addRoyalty(account.totalRoyalty);
      }

      for(let i: number = 0; i < account.createdArtworks.length; i++) {
        let artwork: Artwork = MarketplaceFactory.createArtwork(data.marketplace, account.createdArtworks[i].id, account.createdArtworks[i].lastTransferPrice);
        this.artworks[data.marketplace][i] = artwork;
        artwork.refreshMetadata(account.createdArtworks[i].uri, this.ipfsMetadataService);
      }
    }

  ngOnInit() {
    for (let marketplace in Marketplace) {
      if (!isNaN(Number(marketplace))) {
        this.theGraphService.getArtistData(Number(marketplace), this.ACCOUNT).subscribe(this._cbArtistData);
      }
    }
  }
}