import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TrainingDifficulty, TrainingLevel } from '../training/training.page';
import { SupabaseService } from '../services/supabase/supabase.service';
import { PushupService } from '../services/pushups/pushup.service';

@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.page.html',
  standalone: false,
  styleUrls: ['./training-session.page.scss'],
})
export class TrainingSessionPage implements OnInit {
  @ViewChild('timerSvg', { static: false })
  timerSvg!: ElementRef<SVGSVGElement>;

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
  isEnded: boolean = false;
  isActionSheetOpen = false;

  public actionSheetButtons = [
    {
      text: 'Trop facile',
      data: {
        action: 'easy',
      },
    },
    {
      text: 'Parfait',
      data: {
        action: 'normal',
      },
    },
    {
      text: 'Trop dur',
      data: {
        action: 'hard',
      },
    },
  ];

  private restTimer: any;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private matchService: PushupService,
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

  checkReps(reps: number) {
    if (reps <= 0) this.completeSet();
  }

  skipTimer() {
    this.restTimeRemaining = 0;
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
          this.presentToast(
            `Prêt pour le Set ${this.currentSet + 1}!`,
            'primary'
          );
        }
      }, 1000);
    } else {
      this.logTrainingSession();
    }
  }

  logResult(event: CustomEvent<any>) {
    switch (event.detail.data.action) {
      case 'easy':
        this.insertProgress(this.getNextLevel(2));
        break;
      case 'normal':
        this.insertProgress(this.getNextLevel());
        break;
      case 'hard':
        this.insertProgress(this.getNextLevel(-1));
        break;
      default:
        this.insertProgress(this.getNextLevel());
        break;
    }
  }

  private async insertProgress(nextLevel: number) {
    const totalPushups = this.training.sets * this.training.reps;
    try {
      await this.matchService.addExerciseRecord(totalPushups);
      await this.supabaseService.updateTrainingProgress(
        nextLevel,
        this.difficulty
      );
      this.presentToast(
        `Niveau complété ${this.level.level} ${this.difficulty}! Progression au niveau ${nextLevel}.`,
        'success'
      );
      this.isTrainingStarted = false;
      this.router.navigate(['/training']);
    } catch (error) {
      this.presentToast(
        'Error logging training session: ' + (error as Error).message,
        'danger'
      );
    }
  }

  private getNextLevel(increment: number = 1) {
    return this.level.level < 10 ? this.level.level + increment : 10;
  }

  async logTrainingSession() {
    this.isEnded = true;
    this.isActionSheetOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
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

  getCircumference(): number {
    const svgWidth =
      this.timerSvg?.nativeElement?.getBoundingClientRect().width || 100;
    const radius = svgWidth * 0.45;
    return 2 * Math.PI * radius;
  }

  getStrokeDashoffset(): number {
    const svgWidth =
      this.timerSvg?.nativeElement?.getBoundingClientRect().width || 100; // Default to 100 if not rendered
    const radius = svgWidth * 0.45; // 45% of actual width
    const circumference = 2 * Math.PI * radius;
    return circumference * (1 - this.restProgress);
  }
}
