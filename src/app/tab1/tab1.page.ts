import { Component } from '@angular/core';
import { PushupRecord } from '../services/pushups/pushup.model';
import { PushupService } from '../services/pushups/pushup.service';
import { UserInfo } from '../services/supabase/supabase.model';
import { SupabaseService } from '../services/supabase/supabase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  newRecord: PushupRecord = {
    deaths: 0,
    isWin: false,
    hasPentakill: false,
    pentakillNumber: 0,
    date: new Date(),
    hasSurrender: false,
    surrenderingTeam: null,
  };
  records: PushupRecord[] = [];
  userInfo: UserInfo | null = null;

  constructor(
    private matchService: PushupService,
    private supabaseService: SupabaseService
  ) {
    this.loadRecords();
  }

  async ngOnInit() {
    const userInfo = await this.supabaseService.getUserInfo();
    if (userInfo) {
      this.userInfo = userInfo;
    }
  }

  async loadRecords() {
    this.records = await this.matchService.getRecords();
  }

  async saveMatch() {
    if (this.newRecord.deaths >= 0) {
      await this.matchService.addRecord({ ...this.newRecord });
      this.resetForm();
      await this.loadRecords();
    }
  }

  resetForm() {
    this.newRecord = {
      deaths: 0,
      date: new Date(),
      isWin: false,
      pentakillNumber: 0,
      hasPentakill: false,
      hasSurrender: false,
      surrenderingTeam: null,
    };
  }

  onSurrenderChange() {
    if (!this.newRecord.hasSurrender) {
      this.newRecord.surrenderingTeam = null;
    }
  }

  onPentakillChange() {
    if (!this.newRecord.hasPentakill) {
      this.newRecord.pentakillNumber = 0;
    }
  }
}
