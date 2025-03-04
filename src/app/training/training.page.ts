import { Component, OnInit, ViewChild } from '@angular/core';
import { SupabaseService } from '../services/supabase/supabase.service';
import { IonModal, ToastController } from '@ionic/angular';
import { program } from 'src/assets/program';
import { Router } from '@angular/router';

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

export interface TrainingEntry {
  difficulty: 'beginner' | 'intermediate' | 'advanced' | string;
  level: number;
  name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  total_pushups: number;
}

@Component({
  standalone: false,
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  trainingProgram: TrainingLevel[] = program;

  selectedDifficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  selectedDifficultyNumber: number = 1;
  currentLevel: number = 1;
  currentSet: number = 0;
  isResting: boolean = false;
  restTimeRemaining: number = 0;

  constructor(
    private router: Router,
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
      }
    } catch (error) {
      this.presentToast(
        'Error loading progress: ' + (error as Error).message,
        'danger'
      );
    }
  }

  startTrainingSession() {
    this.router.navigate(['/training-session'], {
      state: {
        level: this.trainingProgram[this.currentLevel - 1],
        difficulty: this.selectedDifficulty,
      },
    });
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

  get sortedLevels(): TrainingEntry[] {
    const difficultyOrder: { [key: string]: number } = {
      beginner: 0,
      intermediate: 1,
      advanced: 2,
    };

    return this.trainingProgram
      .flatMap((level) => [
        {
          difficulty: 'beginner',
          level: level.level,
          name: level.name,
          sets: level.difficulties.beginner.sets,
          reps: level.difficulties.beginner.reps,
          rest_seconds: level.difficulties.beginner.rest_seconds,
          total_pushups:
            level.difficulties.beginner.sets * level.difficulties.beginner.reps,
        },
        {
          difficulty: 'intermediate',
          level: level.level,
          name: level.name,
          sets: level.difficulties.intermediate.sets,
          reps: level.difficulties.intermediate.reps,
          rest_seconds: level.difficulties.intermediate.rest_seconds,
          total_pushups:
            level.difficulties.intermediate.sets *
            level.difficulties.intermediate.reps,
        },
        {
          difficulty: 'advanced',
          level: level.level,
          name: level.name,
          sets: level.difficulties.advanced.sets,
          reps: level.difficulties.advanced.reps,
          rest_seconds: level.difficulties.advanced.rest_seconds,
          total_pushups:
            level.difficulties.advanced.sets * level.difficulties.advanced.reps,
        },
      ])
      .sort((a, b) => {
        const diffOrder =
          difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        return diffOrder !== 0 ? diffOrder : a.level - b.level;
      });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async newLevel(level: TrainingEntry) {
    this.modal.dismiss(null, 'cancel');

    try {
      await this.supabaseService.updateTrainingProgress(
        level.level,
        level.difficulty
      );
      this.presentToast(
        `Niveau modifié ${level.level} ${level.difficulty}.`,
        'secondary'
      );
      await this.loadProgress();
    } catch (error) {
      this.presentToast(
        'Error updating training session: ' + (error as Error).message,
        'danger'
      );
    }
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.loadProgress();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
}
