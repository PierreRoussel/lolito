import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExercisePageRoutingModule } from './exercise-routing.module';

import { ExercisePage } from './exercise.page';
import { ThemeSwitcherComponent } from "../components/shared/theme-switcher/theme-switcher.component";
import { PushupCounterComponent } from "../components/pushup/pushup-counter/pushup-counter.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExercisePageRoutingModule,
    ThemeSwitcherComponent,
    PushupCounterComponent
],
  declarations: [ExercisePage]
})
export class ExercisePageModule {}
