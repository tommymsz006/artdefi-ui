import * as BN from 'bn.js';
import * as Web3Utils from 'web3-utils';

import { IpfsMetadataService } from './ipfs-metadata.service';

export abstract class Artwork {
  id: string;
  name: string;
  lastTransferPrice: BN;
  artist: string;
  description: string;
  imageUrl: string;
  detailUrl: string;

  protected readonly MAX_DESC_LENGTH = 100;
  protected readonly IPFS_PREFIX: string = 'https://ipfs.infura.io/ipfs/';

  _cbRefreshMetadata = data => {
      this.setMetadata(data);
    }

  constructor(id: string, lastTransferPrice: string) {
    this.id = id;
    if (lastTransferPrice != undefined && lastTransferPrice !== '') {
      this.lastTransferPrice = Web3Utils.toBN(lastTransferPrice);
    }
  }

  getLastTransferPriceInEther(): string {
    return (this.lastTransferPrice != undefined) ? Web3Utils.fromWei(this.lastTransferPrice, 'ether') : undefined;
  }

  refreshMetadata(uri: string, ipfsMetadataService: IpfsMetadataService) {
    ipfsMetadataService.getMetadata(uri).subscribe(this._cbRefreshMetadata);
  }

  setMetadata(data) {
    console.log(data);
    this.name = data.name;
    this.description = (data.description.length < this.MAX_DESC_LENGTH) ? data.description : data.description.slice(0, this.MAX_DESC_LENGTH).concat('...');
    this.imageUrl = (data.image.startsWith('http')) ? data.image : this.IPFS_PREFIX.concat(data.image);
  }
}

export class SuperRareArtwork extends Artwork {

  private readonly URL_PREFIX: string = 'https://superrare.co/artwork-v2/';

  setMetadata(metadata) {
    super.setMetadata(metadata);

    this.artist = metadata.createdBy;

    let regex = / /g;
    this.detailUrl = this.URL_PREFIX.concat(this.name.toLowerCase().replace(regex, "-")).concat("-").concat(this.id);
  }
}

export class AsyncArtArtwork extends Artwork {

  private readonly URL_PREFIX: string = 'https://async.art/art/master/0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad-';

  setMetadata(metadata) {
    super.setMetadata(metadata);

    if (typeof metadata.attributes !== 'undefined') {
      for(let i = 0; i < metadata.attributes.length; i++) {
        if (metadata.attributes[i].trait_type == "Artist") {
          this.artist = (this.artist == undefined) ? metadata.attributes[i].value : this.artist.concat(", ").concat(metadata.attributes[i].value);
        }
      }
    }

    this.detailUrl = this.URL_PREFIX.concat(this.id);
  }
}