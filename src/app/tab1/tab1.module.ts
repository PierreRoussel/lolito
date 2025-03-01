import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ThemeSwitcherComponent } from '../components/shared/theme-switcher/theme-switcher.component';
import { HeaderComponent } from '../components/shared/header/header.component';
import { HorizontalListCardComponent } from '../components/shared/horizontal-list-card/horizontal-list-card.component';
import { AvatarComponent } from "../components/shared/ui/avatar/avatar.component";
import { CreateEditMatchRecordComponent } from "../components/create-edit-match-record/create-edit-match-record.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ThemeSwitcherComponent,
    HeaderComponent,
    HorizontalListCardComponent,
    AvatarComponent,
    CreateEditMatchRecordComponent
],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
