import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase/supabase.service';
import { ToastController } from '@ionic/angular';
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
        level: this.trainingProgram[this.currentLevel],
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
}
