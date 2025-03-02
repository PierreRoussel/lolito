import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TrainingDifficulty, TrainingLevel } from '../training/training.page';

@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.page.html',
  standalone: false,
  styleUrls: ['./training-session.page.scss'],
})
export class TrainingSessionPage implements OnInit {
  level: TrainingLevel;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  training: TrainingDifficulty;
  currentSet: number = 0;
  isResting: boolean = false;
  restTimeRemaining: number = 0;
  restTimeTotal: number = 0;
  isTrainingStarted: boolean = false;
  progress: number = 0;
  restProgress: number = 1;
  private restTimer: any;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.level = navigation?.extras.state?.['level'];
    this.difficulty = navigation?.extras.state?.['difficulty'] || 'beginner';
    this.training = this.level.difficulties[this.difficulty];
    this.restTimeTotal = this.training.rest_seconds;
  }

  ngOnInit() {
    if (!this.level) {
      this.router.navigate(['/training']);
    }
  }

  startTraining() {
    this.isTrainingStarted = true;
    this.currentSet = 0;
    this.isResting = false;
    this.restTimeRemaining = 0;
    this.progress = 0;
    clearInterval(this.restTimer);
  }

  completeSet() {
    if (!this.isTrainingStarted) {
      this.startTraining();
      return;
    }
    this.currentSet++;
    this.progress = this.currentSet / this.training.sets;

    if (this.currentSet < this.training.sets) {
      this.isResting = true;
      this.restProgress = 1;
      this.restTimeRemaining = this.training.rest_seconds;
      this.restTimer = setInterval(() => {
        this.restTimeRemaining--;
        this.restProgress = this.restTimeRemaining / this.restTimeTotal;
        if (this.restTimeRemaining <= 0) {
          clearInterval(this.restTimer);
          this.isResting = false;
          this.presentToast(`Ready for Set ${this.currentSet + 1}!`, 'primary');
        }
      }, 1000);
    } else {
      this.logTrainingSession();
    }
  }

  async logTrainingSession() {
    const totalPushups = this.training.sets * this.training.reps;
    console.log('totalPushups', totalPushups);
    // try {
    //   await this.matchService.addRecord({
    //     deaths: 0,
    //     pushups: totalPushups,
    //     is_win: false,
    //     has_pentakill: false,
    //     has_surrender: false,
    //     surrendering_team: null,
    //   });

    //   const newLevel = this.level.level < 10 ? this.level.level + 1 : 10;
    //   await this.supabaseService.updateTrainingProgress(
    //     newLevel,
    //     this.difficulty
    //   );
    //   this.presentToast(
    //     `Completed Level ${this.level.level} ${this.difficulty}! Progressed to Level ${newLevel}.`,
    //     'success'
    //   );
    //   this.isTrainingStarted = false;
    //   this.router.navigate(['/training']);
    // } catch (error) {
    //   this.presentToast(
    //     'Error logging training session: ' + (error as Error).message,
    //     'danger'
    //   );
    // }
  }

  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
    await toast.present();
  }

  getStrokeDashoffset(): number {
    const circumference = 2 * Math.PI * 45; // 282.6 for radius = 45
    return circumference * (1 - this.restProgress); // Decrease from full to 0
  }
}
