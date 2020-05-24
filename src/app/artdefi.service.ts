import { Injectable, Inject } from '@angular/core';

import { Observable, from } from "rxjs";
import { map } from 'rxjs/operators';

import { WEB3_TOKEN } from './web3-token';
import Web3 from 'web3';
import * as BN from 'bn.js';

@Injectable({
  providedIn: 'root'
})
export class ArtDeFiService {

  private readonly ARTDEFI_POOL_ADDRESS = '0x23e1Ebf54214b602B0CeF09714e5D9Ee8B22046C';
  private readonly ERC20_ADDRESS = '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd';
  private readonly ARTDEFI_EVALUATOR_ADDRESS = '0x5E1375Ad4e0dF45ee7532528Dd54bd3d51C6434e';
  private readonly APPROVE_AMOUNT = '1000000000000000000000000';
  private _poolContract = new this.web3.eth.Contract(
    [{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"liquidityReserveAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"loanReserveAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"addressesProvider","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"liquidityATokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_providerAddress","type":"address"},{"name":"_liquidityReserveAddress","type":"address"},{"name":"_liquidityATokenAddress","type":"address"},{"name":"_loanReserveAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"borrow","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"repay","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCumulatedUserBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCumulatedUserLoan","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"clearReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"clearAToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    this.ARTDEFI_POOL_ADDRESS
  );
  private _erc20Contract = new this.web3.eth.Contract(
    [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    this.ERC20_ADDRESS
  );
  private _evaluatorContract = new this.web3.eth.Contract(
    [{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"jobId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"requestId2User","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"userArtworkIncome","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_oracle","type":"address"},{"name":"_jobId","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"constant":false,"inputs":[{"name":"_userAddress","type":"string"}],"name":"populateUserArtworkIncome","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_requestId","type":"bytes32"},{"name":"_result","type":"bytes32"}],"name":"fulfill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_userAddress","type":"address"},{"name":"_loanAmount","type":"uint256"}],"name":"evaluateScoring","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_requestId","type":"bytes32"},{"name":"_payment","type":"uint256"},{"name":"_callbackFunctionId","type":"bytes4"},{"name":"_expiration","type":"uint256"}],"name":"cancelRequest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawLink","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    this.ARTDEFI_EVALUATOR_ADDRESS
  );

  constructor(
    @Inject(WEB3_TOKEN) private web3: Web3) {
  }

  retrieveAccount(): Observable<string> {
    return from(this.web3.eth.getAccounts()).pipe(
                            map(accounts => {
                              if (accounts != undefined) {
                                this.web3.eth.defaultAccount = accounts[0];
                              }
                              return this.web3.eth.defaultAccount;
                            })
                          );
  }

  getAccount() {
    return this.web3.eth.defaultAccount;
  }

  getCumulatedUserBalance(): Observable<any> {
    return from(this._poolContract.methods.getCumulatedUserBalance(this.getAccount()).call({}));
  }

  getCumulatedUserLoan(): Observable<any> {
    return from(this._poolContract.methods.getCumulatedUserLoan(this.getAccount()).call({}));
  }

  getWalletBalance(): Observable<any> {
    return from(this._erc20Contract.methods.balanceOf(this.getAccount()).call({}));
  }

  getIsERC20Locked(): Observable<any> {
    return from(this._erc20Contract.methods.allowance(this.getAccount(), this.ARTDEFI_POOL_ADDRESS).call({})).pipe(
                                                                    map(data => {
                                                                      return (data == '0');
                                                                    })
                                                                  );
  }

  unlockERC20(): Observable<any> {
    return from(this._erc20Contract.methods.approve(this.ARTDEFI_POOL_ADDRESS, this.APPROVE_AMOUNT).send({from: this.getAccount()}));
  }

  deposit(_amount: string): Observable<any> {
    return from(this._poolContract.methods.deposit(_amount).send({from: this.getAccount()}));
  }

  withdraw(_amount: string): Observable<any> {
    return from(this._poolContract.methods.withdraw(_amount).send({from: this.getAccount()}));
  }

  borrow(_amount: string): Observable<any> {
    return from(this._poolContract.methods.borrow(_amount).send({from: this.getAccount()}));
  }

  repay(_amount: string): Observable<any> {
    return from(this._poolContract.methods.repay(_amount).send({from: this.getAccount()}));
  }

  populateUserArtworkIncome(): Observable<any> {
    return from(this._evaluatorContract.methods.populateUserArtworkIncome('0xd656f8d9cb8fa5aeb8b1576161d0488ee2c9c926').send({from: this.getAccount()}));
    //return from(this._evaluatorContract.methods.populateUserArtworkIncome(this.getAccount()).send({from: this.getAccount()}));
  }

  evaluateScoring(_amount: string): Observable<any> {
    console.log(_amount);
    return from(this._evaluatorContract.methods.evaluateScoring(this.getAccount(), _amount).call({}));
  }
}
