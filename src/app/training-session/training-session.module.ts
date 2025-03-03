import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingSessionPageRoutingModule } from './training-session-routing.module';

import { TrainingSessionPage } from './training-session.page';
import { ThemeSwitcherComponent } from "../components/shared/theme-switcher/theme-switcher.component";
import { DiffucltyPipe } from '../training/diffuclty.pipe';
import { PushupCounterComponent } from "../components/pushup/pushup-counter/pushup-counter.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiffucltyPipe,
    TrainingSessionPageRoutingModule,
    ThemeSwitcherComponent,
    PushupCounterComponent
],
  declarations: [TrainingSessionPage]
})
export class TrainingSessionPageModule {}
