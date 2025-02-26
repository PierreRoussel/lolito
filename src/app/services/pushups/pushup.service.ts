// src/app/services/pushup.service.ts
import { Injectable } from '@angular/core';
import { PushupRecord } from './pushup.model';
import { SupabaseService } from '../supabase/supabase.service';
// import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class PushupService {
  constructor(private supabaseService: SupabaseService) {}

  async addRecord(record: PushupRecord): Promise<PushupRecord> {
    const { data: session } = await this.supabaseService.getSession();
    if (!session?.session) {
      throw new Error('User not authenticated');
    }

    const newRecord = {
      ...record,
      player: session.session.user.id,
    };

    const { data, error } = await this.supabaseService.client
      .from('match')
      .insert(newRecord)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as PushupRecord;
  }

  async getRecords(): Promise<PushupRecord[]> {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user) {
      return [];
    }

    const { data, error } = await this.supabaseService.client
      .from('match')
      .select('*')
      .eq('player', session.session?.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []) as PushupRecord[];
  }
}
