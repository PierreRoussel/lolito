import { Component, OnInit } from '@angular/core';
import { PushupService } from '../services/pushups/pushup.service';
import { ToastController } from '@ionic/angular';

interface DailyPushupTotal {
  date: string;
  total: number;
}
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  standalone: false,
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  dailyPushups: DailyPushupTotal[] = [];
  maxPushups: number = 0; // For scaling the bars
  pushupsStats: {
    totalPushups: number;
    maxDailyPushups: { date: string; total: number } | null;
  } | null = null;

  constructor(
    private matchService: PushupService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.initData();
  }

  async initData() {
    await this.loadDailyPushups();
    this.pushupsStats = await this.matchService.getPushupStats();
  }

  handleRefresh(event: CustomEvent) {
    console.log("??");

    setTimeout(() => {
      // Any calls to load data go here
      this.initData();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  async loadDailyPushups() {
    try {
      this.dailyPushups = await this.matchService.getDailyPushupTotals();
      this.maxPushups = Math.max(...this.dailyPushups.map((d) => d.total), 0);
    } catch (error) {
      this.presentToast(
        'Erreur du chargement des stats: ' + (error as Error).message
      );
    }
  }

  getBarHeight(total: number): string {
    if (this.maxPushups === 0) return '0%';
    return `${(total / this.maxPushups) * 100}%`; // Scale height relative to max
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
