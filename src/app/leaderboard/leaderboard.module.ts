import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaderboardPageRoutingModule } from './leaderboard-routing.module';

import { LeaderboardPage } from './leaderboard.page';
import { HeaderComponent } from "../components/shared/header/header.component";
import { FriendRedirectionComponent } from "../components/shared/friend-redirection/friend-redirection.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaderboardPageRoutingModule,
    HeaderComponent,
    FriendRedirectionComponent
],
  declarations: [LeaderboardPage]
})
export class LeaderboardPageModule {}
