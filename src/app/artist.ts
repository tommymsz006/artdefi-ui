import * as BN from 'bn.js';
import * as Web3Utils from 'web3-utils';

export class Artist {
  id: string;
  totalPrimaryIncome: BN;
  totalRoyalty: BN;

  constructor(id: string, totalPrimaryIncome: string, totalRoyalty: string) {
    this.id = id;
    this.totalPrimaryIncome = Web3Utils.toBN(totalPrimaryIncome);
    this.totalRoyalty = Web3Utils.toBN(totalRoyalty);
  }

  getTotalPrimaryIncomeInEther(): string {
    return Web3Utils.fromWei(this.totalPrimaryIncome, 'ether');
  }

  getTotalRoyaltyInEther(): string {
    return Web3Utils.fromWei(this.totalRoyalty, 'ether');
  }

  addPrimaryIncome(primaryIncome: string) {
    this.totalPrimaryIncome = this.totalPrimaryIncome.add(Web3Utils.toBN(primaryIncome));
  }

  addRoyalty(royalty: string) {
    this.totalRoyalty = this.totalRoyalty.add(Web3Utils.toBN(royalty));
  }
}
