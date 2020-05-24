import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { TheGraphService, TheGraphData } from '../the-graph.service';
import { IpfsMetadataService } from '../ipfs-metadata.service';
import { ArtDeFiService } from '../artdefi.service';

import BN from 'bn.js';
import * as Web3Utils from 'web3-utils';
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
  account: string;
  balance: BN;
  loan: BN;
  scoring: BN;
  walletBalance: BN;
  isErc20Locked: boolean;
  isDepositLoading: boolean;
  isLoanLoading: boolean;
  @Input() depositInput: string;
  @Input() loanInput: string;

  private readonly ROUND_FACTOR = Web3Utils.toBN('1000000000000000');  // 1e15

  constructor(
    private theGraphService: TheGraphService,
    private ipfsMetadataService: IpfsMetadataService,
    private artDeFiService: ArtDeFiService,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
    this.artworks = [];
    for (let marketplace in Marketplace) {
      if (!isNaN(Number(marketplace))) {
        this.artworks[Number(marketplace)] = [];
      }
    }
    this.isErc20Locked = true;
  }

  getMarketplace(marketplace: Marketplace): string {
    return Marketplace[marketplace];
  }

  private readonly _cbArtistData = data => {
      console.log(data);
      let account = data.artist.data.account;
      if (account != undefined) {
        this.artist.addPrimaryIncome(account.totalPrimaryIncome);
        this.artist.addRoyalty(account.totalRoyalty);

        for(let i: number = 0; i < account.createdArtworks.length; i++) {
          let artwork: Artwork = MarketplaceFactory.createArtwork(data.marketplace, account.createdArtworks[i].id, account.createdArtworks[i].lastTransferPrice);
          this.artworks[data.marketplace][i] = artwork;
          artwork.refreshMetadata(account.createdArtworks[i].uri, this.ipfsMetadataService);
        }
      }
    }

  ngOnInit() {
    this.account = this.artDeFiService.getAccount();

    if (this.account != undefined) {
      this.artist = new Artist(this.account);
      this.artistIcon = this.domSanitizer.bypassSecurityTrustHtml(Jazzicon(40, parseInt(this.artist.id.slice(2, 10), 16)).outerHTML);

      // get artist data
      console.log(this.artist);
      for (let marketplace in Marketplace) {
        if (!isNaN(Number(marketplace))) {
          this.theGraphService.getArtistData(Number(marketplace), this.account).subscribe(this._cbArtistData);
        }
      }
    } else {
      this.router.navigateByUrl('/wallet');
    }

    this._refreshBalanceAndLoan();
  }



  unlockERC20() {
    this.isDepositLoading = true;
    this.artDeFiService.unlockERC20().subscribe(data => {
                                                  this.isDepositLoading = false;
                                                  this.isErc20Locked = false;
                                                });
  }

  populateUserArtworkIncome() {
    this.artDeFiService.populateUserArtworkIncome();
  }

  deposit() {
    this.isDepositLoading = true;
    this.artDeFiService.deposit(Web3Utils.toWei(this.depositInput)).subscribe(data => {
                                                  this._refreshBalanceAndLoan();
                                                  this.isDepositLoading = false;
                                                });
  }

  borrow() {
    this.isLoanLoading = true;
    this.artDeFiService.borrow(Web3Utils.toWei(this.loanInput)).subscribe(data => {
                                                  this._refreshBalanceAndLoan();
                                                  this.isLoanLoading = false;
                                                });
  }
  
  private _refreshBalanceAndLoan() {
    // get artist balance and loan
    this.artDeFiService.getCumulatedUserBalance().subscribe(data => {
                                                      this.balance = Web3Utils.toBN(data);
                                                      this.artDeFiService.evaluateScoring(data).subscribe(data => {
                                                                this.scoring = Web3Utils.toBN(data);
                                                              });
                                                    });
    this.artDeFiService.getCumulatedUserLoan().subscribe(data => {
                                                      this.loan = Web3Utils.toBN(data);
                                                    });
    this.artDeFiService.getWalletBalance().subscribe(data => {
                                                      this.walletBalance = Web3Utils.toBN(data);
                                                    });

    this.artDeFiService.getIsERC20Locked().subscribe(data => {
                                                      this.isErc20Locked = data;
                                                    });
  }

  private _displayBN(num: BN): string {
    return (num != null) ? Web3Utils.fromWei(num.div(this.ROUND_FACTOR).mul(this.ROUND_FACTOR), 'ether') : '0';
  }

  private _isZero(num: BN): boolean {
    return (num == undefined || num.isZero());
  }

  private _displayScoring(): string {
    return (this._isZero(this.balance) || this._isZero(this.scoring)) ? 'N/A' : this.scoring.toString(10);
  }

  private _getMaxLoan(): string {
    let loan: BN = new BN(0);
    if (this.balance != undefined && this.scoring != undefined) {
      loan = this.balance.mul(this.scoring.mul(new BN(25)).add(new BN(75000))).div(new BN(100000));
    }
    return this._displayBN(loan);
  }

  private _getMaxLoanPercentage(): string {
    let percentage: BN = new BN(0);
    if (this.balance != undefined && this.scoring != undefined) {
      percentage = this.scoring.mul(new BN(25)).add(new BN(75000)).div(new BN(1000));
    }
    return percentage.toString(10);
  }
}