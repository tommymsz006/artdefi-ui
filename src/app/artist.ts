import * as BN from 'bn.js';
import * as Web3Utils from 'web3-utils';

export class Artist {
  id: string;
  totalPrimaryIncome: BN;
  totalRoyalty: BN;

  private readonly ZERO: BN = Web3Utils.toBN('0');

  constructor(id: string) {
    this.id = id;
    this.totalPrimaryIncome = this.ZERO;
    this.totalRoyalty = this.ZERO;
  }

  addPrimaryIncome(primaryIncome: string) {
    this.totalPrimaryIncome = this.totalPrimaryIncome.add(Web3Utils.toBN(primaryIncome));
  }

  addRoyalty(royalty: string) {
    this.totalRoyalty = this.totalRoyalty.add(Web3Utils.toBN(royalty));
  }
}
