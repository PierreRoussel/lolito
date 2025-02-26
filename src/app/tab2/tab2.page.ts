import { Component } from '@angular/core';
import { PushupService } from '../services/pushups/pushup.service';
import { SupabaseService } from '../services/supabase/supabase.service';
import { PushupRecord } from '../services/pushups/pushup.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  records: PushupRecord[] = [];

  constructor(
    private matchService: PushupService,
    private supabaseService: SupabaseService
  ) {
    this.loadRecords();
  }

  async loadRecords() {
    this.records = await this.matchService.getRecords();
  }
}
