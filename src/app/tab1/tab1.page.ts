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
  userInfo: UserInfo | null = null;

  pushupsStats: {
    totalPushups: number;
    maxDailyPushups: { date: string; total: number } | null;
  } | null = null;

  constructor(
    private matchService: PushupService,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.refreshTotalPushups();
    const userInfo = await this.supabaseService.getUserInfo();
    if (userInfo) {
      this.userInfo = userInfo;
    }
  }

  async createMatchRecord(match: PushupRecord){
    this.matchService.addRecord({ ...match });
  }

  async refreshTotalPushups() {
    this.pushupsStats = await this.matchService.getPushupStats();
  }

}
