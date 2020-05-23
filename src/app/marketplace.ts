import { Artwork, SuperRareArtwork, AsyncArtArtwork } from './artwork';

export enum Marketplace {
  SuperRare,
  AsyncArt
}

export class MarketplaceFactory {
  static createArtwork(marketplace: Marketplace, id: string, lastTransferPrice: string) {
    let artwork: Artwork;
    if (marketplace == Marketplace.SuperRare) {
      artwork = new SuperRareArtwork(id, lastTransferPrice);
    } else if (marketplace == Marketplace.AsyncArt) {
      artwork = new AsyncArtArtwork(id, lastTransferPrice);
    }
    return artwork;
  }

  static getTheGraphUrl(marketplace: Marketplace): string {
    let theGraphUrl: string;
    if (marketplace == Marketplace.SuperRare) {
      theGraphUrl = 'https://api.thegraph.com/subgraphs/name/tommymsz006/superrare-v2';
    } else if (marketplace == Marketplace.AsyncArt) {
      theGraphUrl = 'https://api.thegraph.com/subgraphs/name/tommymsz006/async-art';
    }
    return theGraphUrl;
  }
}
