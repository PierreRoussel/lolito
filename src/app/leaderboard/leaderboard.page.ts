import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { PushupService } from '../services/pushups/pushup.service';
import { StatisticsPage } from '../statistics/statistics.page';

interface LeaderboardEntry {
  display_name: string;
  total_pushups: number;
  isUser?: boolean;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  standalone: false,
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  component = StatisticsPage;
  leaderboard: LeaderboardEntry[] = [];
  animate: boolean = false;

  constructor(
    private pushupService: PushupService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.loadLeaderboard();
  }

  async loadLeaderboard() {
    try {
      this.animate = false;
      this.leaderboard = await this.pushupService.getPushupLeaderboard();
      setTimeout(() => (this.animate = true), 0);
    } catch (error) {
      this.presentToast(
        'Error loading leaderboard: ' + (error as Error).message,
        'danger'
      );
    }
  }

  async refreshLeaderboard() {
    await this.loadLeaderboard();
    this.presentToast('Leaderboard refreshed!', 'success');
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

  getMedalIcon(rank: number): string {
    switch (rank) {
      case 0:
        return 'medal'; // Gold
      case 1:
        return 'medal'; // Silver
      case 2:
        return 'medal'; // Bronze
      default:
        return '';
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
