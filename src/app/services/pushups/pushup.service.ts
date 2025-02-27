import { Injectable } from '@angular/core';
import { PushupRecord } from './pushup.model';
import { SupabaseService } from '../supabase/supabase.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PushupService {
  constructor(
    private supabaseService: SupabaseService,
    private toastController: ToastController
  ) {}

  private async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

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
      await this.presentToast(
        "Erreur à l'enregistrement: " + error.message,
        'danger'
      );
      throw error;
    }
    await this.presentToast('Match enregistré', 'success');
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

  async getTotalPushups(): Promise<number> {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabaseService.client
      .from('match')
      .select('pushupNumber')
      .eq('player', session.session.user.id);

    if (error) throw error;

    const total = (data || []).reduce(
      (sum, record) => sum + (record.pushupNumber || 0),
      0
    );
    return total;
  }

  async getDailyPushupTotals(): Promise<{ date: string; total: number }[]> {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabaseService.client
      .from('match')
      .select('pushupNumber, date')
      .eq('player', session.session.user.id);

    if (error) throw error;

    if (!data || data.length === 0) return [];

    const dailyTotals = this.groupByDate(data);
    return Object.entries(dailyTotals)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getPushupStats(): Promise<{
    totalPushups: number;
    maxDailyPushups: { date: string; total: number } | null;
  }> {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabaseService.client
      .from('match')
      .select('pushupNumber, date')
      .eq('player', session.session.user.id);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { totalPushups: 0, maxDailyPushups: null };
    }

    const totalPushups = data.reduce(
      (sum, record) => sum + (record.pushupNumber || 0),
      0
    );
    const dailyTotals = this.groupByDate(data);
    const maxDailyPushups = Object.entries(dailyTotals).reduce(
      (max, [date, total]) => (total > max.total ? { date, total } : max),
      { date: '', total: 0 }
    );

    return {
      totalPushups,
      maxDailyPushups: maxDailyPushups.total > 0 ? maxDailyPushups : null,
    };
  }

  private groupByDate(records: { pushupNumber: number; date: string }[]): {
    [key: string]: number;
  } {
    const grouped: { [key: string]: number } = {};
    records.forEach((record) => {
      const date = new Date(record.date).toLocaleDateString('fr', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      grouped[date] = (grouped[date] || 0) + (record.pushupNumber || 0);
    });
    return grouped;
  }
}
