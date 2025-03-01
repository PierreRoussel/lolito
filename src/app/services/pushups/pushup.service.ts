import { Injectable } from '@angular/core';
import { PushupRecord } from './pushup.model';
import { SupabaseService } from '../supabase/supabase.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PushupService {
  private readonly matchTableName = 'match';
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
      .from(this.matchTableName)
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

  async updateRecord(record: PushupRecord): Promise<PushupRecord> {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user || !record.id) {
      throw new Error('User not authenticated or invalid record');
    }

    const { data, error } = await this.supabaseService.client
      .from(this.matchTableName)
      .update({
        deaths: record.deaths,
        pushupNumber: record.pushupNumber || 0,
        isWin: record.isWin,
        hasPentakill: record.hasPentakill,
        hasSurrender: record.hasSurrender,
      })
      .eq('id', record.id)
      .eq('player', session.session.user.id)
      .select()
      .single();

    if (error) {
      await this.presentToast('Modification ratée: ' + error.message, 'danger');
      throw error;
    }

    await this.presentToast('Match modifié !', 'success');
    return data as PushupRecord;
  }

  async getRecords(): Promise<PushupRecord[]> {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user) {
      return [];
    }

    const { data, error } = await this.supabaseService.client
      .from(this.matchTableName)
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
      .from(this.matchTableName)
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
      .from(this.matchTableName)
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
      .from(this.matchTableName)
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

  async getPushupLeaderboard(): Promise<
    { display_name: string; total_pushups: number }[]
  > {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabaseService.client
      .from('pushup_totals')
      .select('total_pushups, profiles(display_name, id)')
      .order('total_pushups', { ascending: false })
      .limit(10);
    if (error) throw error;

    return (
      (data as unknown as {
        total_pushups: any;
        profiles: {
          display_name: any;
        };
      }[]) || []
    )
      .filter((dd) => dd.profiles?.display_name !== 'Testopepito')
      .map((entry: any) => ({
        display_name: entry.profiles?.display_name || 'Unknown',
        total_pushups: entry.total_pushups,
        ...(session.session.user.id === entry.profiles.id && { isUser: true }),
      }));
  }
}
