import { Component, OnInit } from '@angular/core';
import { PushupService } from '../services/pushups/pushup.service';
import { PushupRecord } from '../services/pushups/pushup.model';
import { ToastController } from '@ionic/angular';
interface GroupedMatches {
  date: string;
  matches: PushupRecord[];
}
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  groupedRecords: GroupedMatches[] = [];
  newItemIds: string[] = [];
  constructor(
    private matchService: PushupService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadRecords();
  }

  async loadRecords() {
    try {
      const records = await this.matchService.getRecords();
      this.groupRecordsByDate(records);
    } catch (error) {
      this.presentToast('Error loading matches: ' + (error as Error).message);
    }
  }

  async refreshRecords() {
    await this.loadRecords();
    this.presentToast('Historique frafraichit!', 'success');
  }

  groupRecordsByDate(records: PushupRecord[]) {
    const grouped: { [key: string]: PushupRecord[] } = {};

    records.forEach((record) => {
      // Extract date (YYYY-MM-DD) from created_at
      const date = new Date(record.created_at!)
        .toLocaleDateString('fr', { dateStyle: 'full' })
        .replace(/./, (c) => c.toUpperCase()) // If you need a capital
        .replace(/,? /, ', '); // If you need a comma

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(record);
    });

    // Convert to array and sort by date (descending)
    this.groupedRecords = Object.keys(grouped)
      .map((date) => ({
        date,
        matches: grouped[date],
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  isNewItem(id: string | undefined): boolean {
    return id ? this.newItemIds.includes(id) : false;
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
