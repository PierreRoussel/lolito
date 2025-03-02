import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingSessionPageRoutingModule } from './training-session-routing.module';

import { TrainingSessionPage } from './training-session.page';
import { ThemeSwitcherComponent } from "../components/shared/theme-switcher/theme-switcher.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingSessionPageRoutingModule,
    ThemeSwitcherComponent
],
  declarations: [TrainingSessionPage]
})
export class TrainingSessionPageModule {}
