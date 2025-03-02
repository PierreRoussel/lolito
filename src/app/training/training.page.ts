import { Component, OnInit } from '@angular/core';
import { PushupService } from '../services/pushups/pushup.service';
import { SupabaseService } from '../services/supabase/supabase.service';
import { ToastController } from '@ionic/angular';
import { program } from 'src/assets/program';

export interface TrainingLevel {
  level: number;
  name: string;
  difficulties: {
    beginner: TrainingDifficulty;
    intermediate: TrainingDifficulty;
    advanced: TrainingDifficulty;
  };
}

export interface TrainingDifficulty {
  sets: number;
  reps: number;
  rest_seconds: number;
}

export interface TrainingProgress {
  id?: string;
  user_id: string;
  level: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed_at?: string;
}

@Component({
  standalone: false,
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {
  trainingProgram: TrainingLevel[] = program;

  selectedDifficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  selectedDifficultyNumber: number = 1;
  currentLevel: number = 1;
  currentSet: number = 0;
  isResting: boolean = false;
  restTimeRemaining: number = 0;
  private restTimer: any;

  constructor(
    private matchService: PushupService,
    private supabaseService: SupabaseService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadProgress();
  }

  async loadProgress() {
    try {
      const progress = await this.supabaseService.getTrainingProgress();
      if (progress) {
        this.currentLevel = progress.level;
        this.selectedDifficulty = progress.difficulty;
        switch (this.selectedDifficulty) {
          case 'beginner':
            this.selectedDifficultyNumber = 1;
            break;
          case 'intermediate':
            this.selectedDifficultyNumber = 2;
            break;
          case 'advanced':
            this.selectedDifficultyNumber = 3;
            break;
        }
      }
    } catch (error) {
      this.presentToast(
        'Error loading progress: ' + (error as Error).message,
        'danger'
      );
    }
  }

  startTraining(level: TrainingLevel) {
    if (level.level !== this.currentLevel) {
      this.presentToast('Please complete your current level first!', 'warning');
      return;
    }
    this.currentSet = 0; // Reset sets
    this.isResting = false;
    this.restTimeRemaining = 0;
    clearInterval(this.restTimer); // Clear any existing timer
  }

  completeSet(level: TrainingLevel) {
    const training = level.difficulties[this.selectedDifficulty];
    this.currentSet++;

    if (this.currentSet < training.sets) {
      // Start rest period
      this.isResting = true;
      this.restTimeRemaining = training.rest_seconds;
      this.restTimer = setInterval(() => {
        this.restTimeRemaining--;
        if (this.restTimeRemaining <= 0) {
          clearInterval(this.restTimer);
          this.isResting = false;
          this.presentToast(`Ready for Set ${this.currentSet + 1}!`, 'primary');
        }
      }, 1000);
    } else {
      // All sets completed, log the session
      this.logTrainingSession(level);
    }
  }

  async logTrainingSession(level: TrainingLevel) {
    const training = level.difficulties[this.selectedDifficulty];
    const totalPushups = training.sets * training.reps;

    try {
      await this.matchService.addExerciseRecord(totalPushups);

      if (this.currentLevel < 10) {
        this.currentLevel++;
        await this.supabaseService.updateTrainingProgress(
          this.currentLevel,
          this.selectedDifficulty
        );
        this.presentToast(
          `Completed Level ${level.level} ${this.selectedDifficulty}! Progressed to Level ${this.currentLevel}.`,
          'success'
        );
      } else {
        this.presentToast(
          'Congratulations! You’ve completed the Hundred Push-ups Program!',
          'success'
        );
      }
      this.currentSet = 0; // Reset for next training
    } catch (error) {
      this.presentToast(
        'Error logging training session: ' + (error as Error).message,
        'danger'
      );
    }
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
}
