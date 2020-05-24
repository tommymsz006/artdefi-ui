import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletComponent } from './wallet/wallet.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/wallet', pathMatch: 'full' },
  { path: 'wallet', component: WalletComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
