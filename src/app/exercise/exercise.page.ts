import { Component, OnInit } from '@angular/core';
import { PushupService } from '../services/pushups/pushup.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  standalone: false,
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage {
  count = 0;
  isLoading = false;
  constructor(
    private pushupService: PushupService,
    private navCtrl: NavController
  ) {}

  setCount(value: number) {
    this.count = value;
  }

  reset() {
    this.count = 0;
  }

  saveExercisePushupNumberAndRedirect() {
    this.isLoading = true;

    this.pushupService.addExerciseRecord(this.count).then(() => {
      this.count = 0;
      this.isLoading = false;
      this.navCtrl.navigateRoot('/tabs/tab1');
    });
  }
}
