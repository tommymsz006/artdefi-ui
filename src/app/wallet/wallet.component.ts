import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ArtDeFiService } from '../artdefi.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(
    private artDeFiService: ArtDeFiService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.artDeFiService.getAccount() != undefined) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  connectToWallet() {
    this.artDeFiService.retrieveAccount().subscribe(account => {
      console.log(account);
      if (account != undefined) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }
}
