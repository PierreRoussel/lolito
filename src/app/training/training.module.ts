import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingPageRoutingModule } from './training-routing.module';

import { TrainingPage } from './training.page';
import { ThemeSwitcherComponent } from "../components/shared/theme-switcher/theme-switcher.component";
import { DiffucltyPipe } from './diffuclty.pipe';
import { PushupCounterComponent } from "../components/pushup/pushup-counter/pushup-counter.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingPageRoutingModule,
    ThemeSwitcherComponent,
    DiffucltyPipe,
    PushupCounterComponent
],
  declarations: [TrainingPage]
})
export class TrainingPageModule {}
