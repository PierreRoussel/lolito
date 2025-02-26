import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountPage } from './account.page';

import { AccountPageRoutingModule } from './account-routing.module';
import { HeaderComponent } from "../components/shared/header/header.component";
import { AvatarComponent } from "../components/shared/ui/avatar/avatar.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AccountPageRoutingModule,
    HeaderComponent,
    AvatarComponent
],
  declarations: [AccountPage]
})
export class AccountPageModule {}
