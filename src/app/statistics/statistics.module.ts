import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatisticsPageRoutingModule } from './statistics-routing.module';

import { StatisticsPage } from './statistics.page';
import { HeaderComponent } from "../components/shared/header/header.component";
import { FriendRedirectionComponent } from "../components/shared/friend-redirection/friend-redirection.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatisticsPageRoutingModule,
    HeaderComponent,
    FriendRedirectionComponent
],
  declarations: [StatisticsPage]
})
export class StatisticsPageModule {}
